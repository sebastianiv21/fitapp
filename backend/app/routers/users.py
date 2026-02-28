from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.middleware.auth import get_current_user
from app.models.profile import Profile
from app.models.progress import Progress
from app.schemas.user import (
    ProfileCreate,
    ProfileResponse,
    ProgressCreate,
    ProgressResponse,
)

router = APIRouter(prefix="/api/v1/user")


@router.post(
    "/profile", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED
)
async def create_profile(
    data: ProfileCreate,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Profile:
    """Create or update the user profile (onboarding data)."""
    existing = await session.get(Profile, user_id)
    if existing:
        for field, value in data.model_dump().items():
            setattr(existing, field, value)
        await session.commit()
        await session.refresh(existing)
        return existing

    profile = Profile(id=user_id, **data.model_dump())
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Profile:
    """Get the current user's profile."""
    profile = await session.get(Profile, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )
    return profile


@router.post(
    "/progress", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED
)
async def record_progress(
    data: ProgressCreate,
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> Progress:
    """Record a new weight/progress entry."""
    entry = Progress(user_id=user_id, **data.model_dump())
    session.add(entry)
    await session.commit()
    await session.refresh(entry)
    return entry


@router.get("/progress", response_model=list[ProgressResponse])
async def get_progress_history(
    user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> list[Progress]:
    """Get the user's progress history, newest first."""
    result = await session.execute(
        select(Progress)
        .where(Progress.user_id == user_id)
        .order_by(Progress.recorded_at.desc())
    )
    return list(result.scalars().all())
