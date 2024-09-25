"""Ajout du champ de réponse admin

Revision ID: 0ceeafd3b86c
Revises: 0268934b2085
Create Date: 2024-09-07 16:14:25.190504

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0ceeafd3b86c'
down_revision = '0268934b2085'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('message', schema=None) as batch_op:
        batch_op.add_column(sa.Column('reply', sa.Text(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('message', schema=None) as batch_op:
        batch_op.drop_column('reply')

    # ### end Alembic commands ###
