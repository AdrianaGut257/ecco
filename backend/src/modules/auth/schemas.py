import re

from pydantic import EmailStr, field_validator

from src.core.moderation import classify
from src.core.schemas import CamelModel
from src.modules.users.schemas import UserOut

NAME_NOT_ALLOWED = "Elige un nombre que cuide a los demás."
PASSWORD_MESSAGE = (
    "Tu contraseña necesita 8 caracteres, una mayúscula, un número y un carácter especial."
)


def _strong(password: str) -> str:
    ok = (
        len(password) >= 8
        and len(password) <= 128
        and re.search(r"[A-Z]", password)
        and re.search(r"[0-9]", password)
        and re.search(r"[^A-Za-z0-9]", password)
    )
    if not ok:
        raise ValueError(PASSWORD_MESSAGE)
    return password


class RegisterIn(CamelModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def valid_name(cls, value: str) -> str:
        value = value.strip()
        if not 2 <= len(value) <= 40:
            raise ValueError("Tu nombre debe tener entre 2 y 40 caracteres.")
        if classify(value) != "ok":
            raise ValueError(NAME_NOT_ALLOWED)
        return value

    @field_validator("email")
    @classmethod
    def lower_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        return _strong(value)


class LoginIn(CamelModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def lower_email(cls, value: str) -> str:
        return value.strip().lower()


class ForgotPasswordIn(CamelModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def lower_email(cls, value: str) -> str:
        return value.strip().lower()


class ResetPasswordIn(CamelModel):
    email: EmailStr
    code: str
    password: str

    @field_validator("email")
    @classmethod
    def lower_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("code")
    @classmethod
    def six_digits(cls, value: str) -> str:
        return _code(value)

    @field_validator("password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        return _strong(value)


def _code(value: str) -> str:
    value = "".join(value.split())
    if len(value) != 6 or not value.isdigit():
        raise ValueError("El código tiene 6 números.")
    return value


class VerifyEmailIn(CamelModel):
    code: str

    @field_validator("code")
    @classmethod
    def six_digits(cls, value: str) -> str:
        return _code(value)


class AuthOut(CamelModel):
    access_token: str
    user: UserOut
