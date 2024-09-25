"""Ajout du modèle Notification

Revision ID: 2d833103f409
Revises: 61f7be6d1f59
Create Date: 2024-09-15 12:06:05.439230

"""
from alembic import op
import sqlalchemy as sa


# Identifiants de la révision
revision = '2d833103f409'
down_revision = '61f7be6d1f59'
branch_labels = None
depends_on = None


def upgrade():
    # Vérifiez si la table existe avant de la créer
    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name='notification'
        ) THEN
            CREATE TABLE notification (
                id SERIAL NOT NULL,
                user_id INTEGER NOT NULL,
                message VARCHAR(255) NOT NULL,
                is_read BOOLEAN,
                timestamp TIMESTAMP WITHOUT TIME ZONE,
                PRIMARY KEY (id),
                FOREIGN KEY(user_id) REFERENCES "user" (id)
            );
        END IF;
    END $$;
    """)


def downgrade():
    op.drop_table('notification')
