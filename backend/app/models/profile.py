from datetime import datetime
from typing import TYPE_CHECKING, List

from sqlalchemy import Enum as SAEnum
from sqlalchemy import String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.enums import ActivityLevel, Gender, Goal

if TYPE_CHECKING:
    from app.models.progress import Progress


class Profile(Base):
    __tablename__ = "profiles"

    # Same ID as the Better Auth user — set by the auth service, not auto-generated
    id: Mapped[str] = mapped_column(String, primary_key=True)
    age: Mapped[int]
    gender: Mapped[Gender] = mapped_column(SAEnum(Gender), nullable=False)
    height_cm: Mapped[float]
    weight_kg: Mapped[float]
    activity_level: Mapped[ActivityLevel] = mapped_column(
        SAEnum(ActivityLevel), nullable=False
    )
    goal: Mapped[Goal] = mapped_column(SAEnum(Goal), nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )

    progress: Mapped[List["Progress"]] = relationship(
        "Progress", back_populates="profile"
    )
