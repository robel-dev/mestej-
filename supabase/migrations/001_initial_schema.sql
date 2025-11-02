-- Mestej Ordering System Database Migration
-- This migration creates all tables, RLS policies, triggers, and initial data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'approved', 'rejected', 'blocked');
CREATE TYPE product_type AS ENUM ('wine', 'liquor', 'merchandise');
CREATE TYPE availability_status AS ENUM ('in_stock', 'out_of_stock');
CREATE TYPE order_status AS ENUM ('placed', 'paid', 'cancelled', 'fulfilled');
CREATE TYPE payment_method AS ENUM ('swish', 'card', 'bank_transfer');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE notification_type AS ENUM ('email', 'system');
CREATE TYPE notification_status AS ENUM ('queued', 'sent', 'failed');

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'user',
    status user_status DEFAULT 'pending',
    permit_document_url TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    is_mestej BOOLEAN DEFAULT false,
    contact JSONB DEFAULT '{}',
    address TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    product_type product_type NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    image_url TEXT,
    abv NUMERIC(4,2),
    volume_ml INT,
    stock_quantity INT DEFAULT 0,
    availability availability_status DEFAULT 'in_stock',
    created_at TIMESTAMP DEFAULT now()
);

-- Product Prices table
CREATE TABLE IF NOT EXISTS product_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    price NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'SEK',
    valid_from TIMESTAMP DEFAULT now(),
    valid_to TIMESTAMP
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient TEXT NOT NULL,
    phone TEXT,
    street TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT DEFAULT 'Sweden',
    created_at TIMESTAMP DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status order_status DEFAULT 'placed',
    total_amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'SEK',
    delivery_addr JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    fulfilled_at TIMESTAMP
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    line_total NUMERIC(12,2) NOT NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    method payment_method NOT NULL,
    provider_id TEXT,
    amount NUMERIC(12,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    attempted_at TIMESTAMP DEFAULT now(),
    paid_at TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    payload JSONB DEFAULT '{}',
    sent_at TIMESTAMP,
    status notification_status DEFAULT 'queued'
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_product_prices_product ON product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_valid ON product_prices(valid_from, valid_to);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number (returns TEXT)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
    date_part TEXT;
    sequence_num INT;
BEGIN
    date_part := TO_CHAR(now(), 'YYYYMMDD');
    
    -- Get the next sequence number for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '\d+$') AS INT)), 0) + 1
    INTO sequence_num
    FROM orders
    WHERE order_number LIKE 'MEST-' || date_part || '-%';
    
    new_order_number := 'MEST-' || date_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to set order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle user approval notification
CREATE OR REPLACE FUNCTION handle_user_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        INSERT INTO notifications (user_id, type, payload, status)
        VALUES (
            NEW.id,
            'email',
            jsonb_build_object(
                'subject', 'Your Mestej Account Has Been Approved',
                'message', 'Congratulations! Your account has been approved. You can now place orders.'
            ),
            'queued'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update order status when payment is completed
CREATE OR REPLACE FUNCTION handle_payment_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
        UPDATE orders
        SET status = 'paid'
        WHERE id = NEW.order_id;
        
        NEW.paid_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-create user profile from auth.users
-- SECURITY DEFINER allows the trigger to bypass RLS when inserting into users table
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at on users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Generate order number on insert
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Handle user approval notifications
CREATE TRIGGER user_approval_trigger
    AFTER UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION handle_user_approval();

-- Handle payment status updates
CREATE TRIGGER payment_update_trigger
    AFTER UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION handle_payment_update();

-- Auto-create user profile when auth user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users RLS Policies
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all users"
    ON users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can approve users"
    ON users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Suppliers RLS Policies (public read, admin write)
CREATE POLICY "Anyone can view suppliers"
    ON suppliers FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage suppliers"
    ON suppliers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Products RLS Policies (public read, admin write)
CREATE POLICY "Anyone can view products"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage products"
    ON products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Product Prices RLS Policies (public read, admin write)
CREATE POLICY "Anyone can view product prices"
    ON product_prices FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage product prices"
    ON product_prices FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Addresses RLS Policies
CREATE POLICY "Users can view own addresses"
    ON addresses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
    ON addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
    ON addresses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
    ON addresses FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses"
    ON addresses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Orders RLS Policies
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Approved users can create orders"
    ON orders FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND status = 'approved'
        )
    );

CREATE POLICY "Admins can view all orders"
    ON orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all orders"
    ON orders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Order Items RLS Policies
CREATE POLICY "Users can view own order items"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert order items for own orders"
    ON order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all order items"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Payments RLS Policies
CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = payments.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert payments for own orders"
    ON payments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = payments.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all payments"
    ON payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all payments"
    ON payments FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Notifications RLS Policies
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications"
    ON notifications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert Suppliers
INSERT INTO suppliers (name, is_mestej, contact, address) VALUES
('Mestej', true, '{"email": "info@mestej.com"}', 'Sweden'),
('Alessandro Bortolin', false, '{}', 'Italy'),
('47 ANNO DOMINI', false, '{}', 'Italy'),
('Corteaura', false, '{}', 'Italy'),
('BELLUSSÌ', false, '{}', 'Italy'),
('MAZOOD', false, '{}', 'Italy'),
('MATUSKO', false, '{}', 'Croatia'),
('Nino Zeni', false, '{}', 'Italy'),
('Premium Wine Supplier', false, '{}', 'Various');

-- Note: Products will be inserted in a separate migration or via application
-- This ensures suppliers exist first

COMMENT ON TABLE users IS 'User profiles linked to Supabase Auth';
COMMENT ON TABLE suppliers IS 'Product suppliers including Mestej';
COMMENT ON TABLE products IS 'Wine, liquor, and merchandise products';
COMMENT ON TABLE product_prices IS 'Price history for products';
COMMENT ON TABLE addresses IS 'User delivery addresses';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE order_items IS 'Individual items in orders';
COMMENT ON TABLE payments IS 'Payment records';
COMMENT ON TABLE notifications IS 'Email and system notifications';
