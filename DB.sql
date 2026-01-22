"Table de Référence"

CREATE TABLE COUNTRIES (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    currency VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PRODUCTS (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ROLES (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- ADMIN | TENANT | USER
    description TEXT
);

"Tables Utilisateurs et Authentification"

CREATE TABLE AUTH_USERS (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    country_id UUID REFERENCES COUNTRIES(id), -- NULL for ADMIN
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE USERS (
    id UUID PRIMARY KEY REFERENCES AUTH_USERS(id),
    country_id UUID REFERENCES COUNTRIES(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE USER_ROLES (
    user_id UUID REFERENCES AUTH_USERS(id),
    role_id UUID REFERENCES ROLES(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE AUTH_SESSIONS (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES AUTH_USERS(id),
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

"Tables Produits et Localisation"

CREATE TABLE COUNTRY_PRODUCTS (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES PRODUCTS(id),
    country_id UUID REFERENCES COUNTRIES(id),
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10),
    quantity INT DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PRODUCT_IMAGES (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES PRODUCTS(id),
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false
);

"Tables Profil et Logs"

CREATE TABLE USER_ADDRESSES (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES USERS(id),
    country_id UUID REFERENCES COUNTRIES(id),
    street TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE USER_PREFERENCES (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES USERS(id),
    language VARCHAR(10),
    timezone VARCHAR(50),
    notifications_enabled BOOLEAN DEFAULT true
);

CREATE TABLE USER_AUDIT_LOGS (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES USERS(id),
    action VARCHAR(255) NOT NULL,
    performed_by UUID, -- Peut être lié à un autre utilisateur
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);