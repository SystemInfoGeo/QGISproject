from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '43a85e1bafc3'
down_revision = '0ceeafd3b86c'
branch_labels = None
depends_on = None


def upgrade():
    # Vérifier si les colonnes 'admin_name' et 'admin_email' existent déjà avant de les ajouter
    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='message' AND column_name='admin_name'
        ) THEN
            ALTER TABLE message ADD COLUMN admin_name VARCHAR(100);
        END IF;
    END $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='message' AND column_name='admin_email'
        ) THEN
            ALTER TABLE message ADD COLUMN admin_email VARCHAR(100);
        END IF;
    END $$;
    """)


def downgrade():
    # Supprimer les colonnes 'admin_name' et 'admin_email' lors du downgrade
    with op.batch_alter_table('message', schema=None) as batch_op:
        batch_op.drop_column('admin_name')
        batch_op.drop_column('admin_email')
