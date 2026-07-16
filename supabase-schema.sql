-- ============================================
-- LaundryEase Database Schema for Christ University
-- Deploy this in your Supabase SQL Editor
-- ============================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ============================================
-- 1. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    hostel_block VARCHAR(50) NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    laundry_quota_remaining DECIMAL(10,2) DEFAULT 7000.00,
    password_hash VARCHAR(255), -- For custom auth (or use Supabase Auth)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_students_id ON students(student_id);
CREATE INDEX idx_students_block ON students(hostel_block);

-- ============================================
-- 2. ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'laundry_head' CHECK (role IN ('laundry_head', 'super_admin', 'staff')),
    hostel_blocks TEXT[] DEFAULT '{}',
    password_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. LAUNDRY REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS laundry_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number SERIAL,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    pickup_date DATE NOT NULL,
    pickup_time_slot VARCHAR(30) NOT NULL,
    items JSONB NOT NULL DEFAULT '{}',
    total_items INT NOT NULL DEFAULT 0,
    wash_type VARCHAR(30) DEFAULT 'Regular Wash',
    detergent VARCHAR(30) DEFAULT 'Standard Detergent',
    special_instructions TEXT,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'picked_up', 'washing', 'ready', 'delivered', 'cancelled')),
    cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    delivery_otp VARCHAR(6), -- OTP for pickup verification
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requests_student ON laundry_requests(student_id);
CREATE INDEX idx_requests_status ON laundry_requests(status);
CREATE INDEX idx_requests_date ON laundry_requests(pickup_date);
CREATE INDEX idx_requests_ticket ON laundry_requests(ticket_number);

-- ============================================
-- 4. STATUS HISTORY TABLE (Audit Log)
-- ============================================
CREATE TABLE IF NOT EXISTS status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES laundry_requests(id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by UUID, -- Can reference admin or system
    changed_by_type VARCHAR(10) DEFAULT 'admin' CHECK (changed_by_type IN ('admin', 'system', 'student')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_status_history_request ON status_history(request_id);

-- ============================================
-- 5. FEEDBACK TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES laundry_requests(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    improvements TEXT[] DEFAULT '{}',
    new_features TEXT,
    easier_laundry TEXT,
    comments TEXT,
    is_resolved BOOLEAN DEFAULT false,
    admin_response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_student ON feedback(student_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);

-- ============================================
-- 6. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    request_id UUID REFERENCES laundry_requests(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('status_update', 'pickup_reminder', 'delivery_ready', 'feedback_request', 'quota_low')),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(20) DEFAULT 'in_app' CHECK (channel IN ('in_app', 'whatsapp', 'sms', 'email', 'push')),
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_student ON notifications(student_id);
CREATE INDEX idx_notifications_unread ON notifications(student_id, is_read) WHERE is_read = false;

-- ============================================
-- 7. HOSTEL BLOCKS REFERENCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hostel_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    total_rooms INT DEFAULT 0,
    capacity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Christ University hostel blocks
INSERT INTO hostel_blocks (name, code, total_rooms, capacity) VALUES
    ('Jonas Hall', 'JH', 120, 240),
    ('Christ Hall A', 'CHA', 100, 200),
    ('Christ Hall B', 'CHB', 100, 200),
    ('Christ Hall C', 'CHC', 80, 160),
    ('St. Kuriakose Elias Hall', 'SKEH', 90, 180),
    ('CST Vidyabhavan', 'CSTV', 60, 120),
    ('Devadan Hall', 'DH', 70, 140),
    ('PG Mens Hostel', 'PGM', 50, 100)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Students can only see their own data
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own profile" ON students
    FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

-- Laundry requests: students see own, admins see all
ALTER TABLE laundry_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own requests" ON laundry_requests
    FOR SELECT USING (
        student_id::text = auth.uid()::text OR 
        EXISTS (SELECT 1 FROM admins WHERE id::text = auth.uid()::text AND is_active = true)
    );

CREATE POLICY "Students create requests" ON laundry_requests
    FOR INSERT WITH CHECK (student_id::text = auth.uid()::text);

CREATE POLICY "Admins update requests" ON laundry_requests
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE id::text = auth.uid()::text AND is_active = true)
    );

-- Feedback: students see own, admins see all
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own feedback" ON feedback
    FOR SELECT USING (
        student_id::text = auth.uid()::text OR 
        EXISTS (SELECT 1 FROM admins WHERE id::text = auth.uid()::text AND is_active = true)
    );

CREATE POLICY "Students create feedback" ON feedback
    FOR INSERT WITH CHECK (student_id::text = auth.uid()::text);

-- Notifications: students see own
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own notifications" ON notifications
    FOR SELECT USING (student_id::text = auth.uid()::text);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON laundry_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Log status changes automatically
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO status_history (request_id, previous_status, new_status, changed_by, changed_by_type, notes)
        VALUES (NEW.id, OLD.status, NEW.status, auth.uid(), 'admin', 
                'Status changed from ' || COALESCE(OLD.status, 'null') || ' to ' || NEW.status);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_request_status_change AFTER UPDATE ON laundry_requests
    FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- Generate delivery OTP when status becomes 'ready'
CREATE OR REPLACE FUNCTION generate_delivery_otp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'ready' AND (OLD.status IS DISTINCT FROM 'ready' OR NEW.delivery_otp IS NULL) THEN
        NEW.delivery_otp = LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_delivery_otp BEFORE UPDATE ON laundry_requests
    FOR EACH ROW EXECUTE FUNCTION generate_delivery_otp();

-- ============================================
-- DEMO DATA (Remove in production)
-- ============================================

-- Sample students
INSERT INTO students (student_id, full_name, email, phone, hostel_block, room_number) VALUES
    ('CHRIST2024001', 'Rahul Sharma', 'rahul.s@christuniversity.in', '9876543210', 'Jonas Hall', '204-B'),
    ('CHRIST2024002', 'Priya Menon', 'priya.m@christuniversity.in', '9876543211', 'Christ Hall A', '112-A'),
    ('CHRIST2024003', 'Arun Kumar', 'arun.k@christuniversity.in', '9876543212', 'Jonas Hall', '305-C'),
    ('CHRIST2024004', 'Sneha Reddy', 'sneha.r@christuniversity.in', '9876543213', 'St. Kuriakose Elias Hall', '201-A'),
    ('CHRIST2024005', 'Vikram Patel', 'vikram.p@christuniversity.in', '9876543214', 'Christ Hall B', '118-B'),
    ('CHRIST2024006', 'Ananya Iyer', 'ananya.i@christuniversity.in', '9876543215', 'Jonas Hall', '402-A'),
    ('CHRIST2024007', 'Karthik Nair', 'karthik.n@christuniversity.in', '9876543216', 'Christ Hall A', '215-C'),
    ('CHRIST2024008', 'Meera Joshi', 'meera.j@christuniversity.in', '9876543217', 'Devadan Hall', '108-B')
ON CONFLICT (student_id) DO NOTHING;

-- Sample admin
INSERT INTO admins (email, full_name, role, hostel_blocks) VALUES
    ('laundry.head@christuniversity.in', 'Laundry Head', 'laundry_head', ARRAY['Jonas Hall', 'Christ Hall A', 'Christ Hall B', 'Christ Hall C', 'St. Kuriakose Elias Hall', 'Devadan Hall'])
ON CONFLICT (email) DO NOTHING;

-- Sample requests
INSERT INTO laundry_requests (student_id, pickup_date, pickup_time_slot, items, total_items, wash_type, detergent, status, cost)
SELECT 
    s.id,
    '2026-07-15',
    '9:00 AM - 11:00 AM',
    '{"shirts": 3, "pants": 2, "towels": 1}'::jsonb,
    6,
    'Regular Wash',
    'Standard Detergent',
    'submitted',
    89
FROM students s WHERE s.student_id = 'CHRIST2024001'
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

CREATE OR REPLACE VIEW daily_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_requests,
    SUM(total_items) as total_items,
    SUM(cost) as total_revenue,
    COUNT(*) FILTER (WHERE status = 'delivered') as delivered_count
FROM laundry_requests
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW block_stats AS
SELECT 
    s.hostel_block,
    COUNT(*) as total_requests,
    SUM(r.total_items) as total_items,
    AVG(f.rating) as avg_rating
FROM laundry_requests r
JOIN students s ON r.student_id = s.id
LEFT JOIN feedback f ON r.id = f.request_id
GROUP BY s.hostel_block;

-- ============================================
-- SETUP COMPLETE
-- Run: SELECT * FROM students LIMIT 5;
-- ============================================