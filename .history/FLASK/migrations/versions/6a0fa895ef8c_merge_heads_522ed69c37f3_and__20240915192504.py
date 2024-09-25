"""Merge heads 522ed69c37f3 and 82b3cd268f69

Revision ID: 6a0fa895ef8c
Revises: 522ed69c37f3, 82b3cd268f69
Create Date: 2024-09-15 19:07:58.027110

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6a0fa895ef8c'
down_revision = ('522ed69c37f3', '82b3cd268f69')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
