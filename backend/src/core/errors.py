from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

GENERIC_VALIDATION = "Hay algo que revisar en lo que enviaste."
VALUE_ERROR_PREFIX = "Value error, "


class AppError(Exception):
    status_code = 400
    default_detail = "Algo no salió como esperábamos."

    def __init__(self, detail: str | None = None):
        self.detail = detail or self.default_detail
        super().__init__(self.detail)


class BadRequest(AppError):
    status_code = 400


class Unauthorized(AppError):
    status_code = 401
    default_detail = "Tu sesión terminó. Vuelve a entrar cuando quieras."


class Forbidden(AppError):
    status_code = 403
    default_detail = "No tienes permiso para hacer esto."


class NotFound(AppError):
    status_code = 404
    default_detail = "No encontramos lo que buscabas."


class Conflict(AppError):
    status_code = 409


class TooManyRequests(AppError):
    status_code = 429
    default_detail = "Demasiados intentos seguidos. Espera un momento y prueba de nuevo."


def _message(error: dict) -> str:
    msg = str(error.get("msg", ""))
    if msg.startswith(VALUE_ERROR_PREFIX):
        return msg[len(VALUE_ERROR_PREFIX):]
    return GENERIC_VALIDATION


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(_: Request, exc: AppError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(RequestValidationError)
    async def validation_handler(_: Request, exc: RequestValidationError):
        errors = [
            {
                "field": ".".join(
                    str(part) for part in err["loc"] if part not in ("body", "query", "path")
                ),
                "message": _message(err),
            }
            for err in exc.errors()
        ]
        detail = errors[0]["message"] if errors else GENERIC_VALIDATION
        return JSONResponse(status_code=422, content={"detail": detail, "errors": errors})
