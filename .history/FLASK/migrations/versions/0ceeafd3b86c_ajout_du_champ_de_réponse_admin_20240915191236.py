from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0ceeafd3b86c'
down_revision = '0268934b2085'
branch_labels = None
depends_on = None


def upgrade():
    # Vérifier si la colonne 'reply' existe déjà avant de l'ajouter
    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='message' AND column_name='reply'
        ) THEN
            ALTER TABLE message ADD COLUMN reply TEXT;
        END IF;
    END $$;
    """)


def downgrade():
    # Supprimer la colonne 'reply' lors du downgrade
    with op.batch_alter_table('message', schema=None) as batch_op:
        batch_op.drop_column('reply')
