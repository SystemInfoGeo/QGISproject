from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0268934b2085'
down_revision = '3989e0f04ba7'
branch_labels = None
depends_on = None


def upgrade():
    # Vérification si la table n'existe pas déjà
    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'message') THEN
            CREATE TABLE message (
                id SERIAL NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                date_received TIMESTAMP WITHOUT TIME ZONE,
                PRIMARY KEY (id)
            );
        END IF;
    END $$;
    """)


def downgrade():
    # Drop la table 'message' si elle existe
    op.drop_table('message')
