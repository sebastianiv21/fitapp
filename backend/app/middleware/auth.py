import logging
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

logger = logging.getLogger(__name__)
security = HTTPBearer()
jwks_client = PyJWKClient(f"{settings.auth_url}/api/auth/jwks", cache_jwk_set=True, lifespan=300)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """Validate Better Auth JWT via JWKS and return the user ID (sub claim)."""
    token = credentials.credentials
    logger.info(f"Validating token, auth_url: {settings.auth_url}")
    logger.debug(f"Token prefix: {token[:50]}..." if len(token) > 50 else f"Token: {token}")

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(token, signing_key.key, algorithms=["EdDSA"], options={"verify_aud": False})
        logger.info(f"Token validated successfully, payload keys: {list(payload.keys())}")
    except Exception as e:
        logger.error(f"Token validation failed: {type(e).__name__}: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {type(e).__name__}")

    user_id: str | None = payload.get("sub")
    if not user_id:
        logger.error("Token missing 'sub' claim")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: missing subject")

    logger.info(f"Authenticated user: {user_id}")
    return user_id
