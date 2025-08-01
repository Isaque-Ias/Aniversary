"""aniversario

Revision ID: 041e6c733717
Revises: 
Create Date: 2025-07-24 11:18:13.903367

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '041e6c733717'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('aniversario',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('person', sa.String(length=64), nullable=False),
    sa.Column('date', sa.DateTime(timezone=32), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('aniversario')
    # ### end Alembic commands ###
