-- CreateTable
CREATE TABLE "AUTH_USERS" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "country_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AUTH_USERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AUTH_SESSIONS" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AUTH_SESSIONS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AUTH_USERS_email_key" ON "AUTH_USERS"("email");

-- AddForeignKey
ALTER TABLE "AUTH_SESSIONS" ADD CONSTRAINT "AUTH_SESSIONS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AUTH_USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
