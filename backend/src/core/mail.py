import logging
from email.message import EmailMessage

import aiosmtplib

from src.config.config import settings

logger = logging.getLogger(__name__)


async def send_email(to: str, subject: str, text: str, html: str | None = None) -> None:
    message = EmailMessage()
    message["From"] = f"{settings.smtp_from_name} <{settings.smtp_from}>"
    message["To"] = to
    message["Subject"] = subject
    message.set_content(text)
    if html:
        message.add_alternative(html, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_username or None,
            password=settings.smtp_password or None,
        )
    except Exception:
        logger.exception("No se pudo enviar el correo a %s", to)


async def send_password_reset(to: str, name: str, link: str, minutes: int) -> None:
    text = (
        f"Hola {name},\n\n"
        "Recibimos una solicitud para crear una nueva contraseña en ECCO.\n"
        f"Entra a este enlace (vale {minutes} minutos):\n{link}\n\n"
        "Si no fuiste tú, puedes ignorar este correo. Tu cuenta sigue segura."
    )
    html = (
        f"<p>Hola {name},</p>"
        "<p>Recibimos una solicitud para crear una nueva contraseña en ECCO.</p>"
        f'<p><a href="{link}">Crear nueva contraseña</a> (vale {minutes} minutos)</p>'
        "<p>Si no fuiste tú, puedes ignorar este correo. Tu cuenta sigue segura.</p>"
    )
    await send_email(to, "Recupera tu contraseña de ECCO", text, html)
