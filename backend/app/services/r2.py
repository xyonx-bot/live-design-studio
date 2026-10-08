"""Uploads to the R2 bucket that serves cdn.joyverse.fun."""
import os
import uuid
import boto3
from botocore.config import Config

_R2 = {
    "endpoint_url": f"https://{os.getenv('R2_ACCOUNT_ID', '')}.r2.cloudflarestorage.com",
    "aws_access_key_id": os.getenv("R2_ACCESS_KEY_ID", ""),
    "aws_secret_access_key": os.getenv("R2_SECRET_ACCESS_KEY", ""),
    "config": Config(signature_version="s3v4"),
    "region_name": "auto",
}
_BUCKET = os.getenv("R2_BUCKET", "cdn")
_PUBLIC = os.getenv("R2_PUBLIC_BASE", "").rstrip("/")


def _client():
    if not all([_R2["aws_access_key_id"], _R2["aws_secret_access_key"], _R2["endpoint_url"]]):
        raise RuntimeError("R2 credentials not configured")
    return boto3.client("s3", **_R2)


def upload(data: bytes, content_type: str, filename_hint: str = "") -> str:
    """Put object, return its public URL."""
    ext = filename_hint.rsplit(".", 1)[-1].lower() if "." in filename_hint else "png"
    if ext not in ("png", "jpg", "jpeg", "gif", "webp", "svg", "avif"):
        ext = "png"
    key = f"chat/{uuid.uuid4().hex[:16]}.{ext}"
    _client().put_object(Bucket=_BUCKET, Key=key, Body=data, ContentType=content_type)
    return f"{_PUBLIC}/{key}" if _PUBLIC else key
