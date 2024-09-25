"""Initial migration

Revision ID: 718d0fa16e26
Revises: 
Create Date: 2024-09-22 16:12:18.671928

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '718d0fa16e26'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('path', schema=None) as batch_op:
        batch_op.drop_column('distance_total')
        batch_op.drop_column('date_created')
        batch_op.drop_column('number_of_trash_bins')
        batch_op.drop_column('estimated_duration')

    with op.batch_alter_table('trash_bins', schema=None) as batch_op:
        batch_op.add_column(sa.Column('comments', sa.String(length=200), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('trash_bins', schema=None) as batch_op:
        batch_op.drop_column('comments')

    with op.batch_alter_table('path', schema=None) as batch_op:
        batch_op.add_column(sa.Column('estimated_duration', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('number_of_trash_bins', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('date_created', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('distance_total', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False))

    # ### end Alembic commands ###
