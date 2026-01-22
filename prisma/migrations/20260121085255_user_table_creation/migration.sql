-- CreateTable
CREATE TABLE "USERS" (
    "id" UUID NOT NULL,
    "country_id" UUID,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone_number" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER_ROLES" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "USER_ROLES_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "USER_ADDRESSES" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "country_id" UUID,
    "street" TEXT,
    "city" TEXT,
    "postal_code" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "USER_ADDRESSES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER_PREFERENCES" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "language" TEXT,
    "timezone" TEXT,
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "USER_PREFERENCES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER_AUDIT_LOGS" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "performed_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "USER_AUDIT_LOGS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROLES" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ROLES_pkey" PRIMARY KEY ("id")
);
