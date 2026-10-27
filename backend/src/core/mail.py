import logging
from email.message import EmailMessage
from html import escape

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
        # 465 usa TLS directo; en los demás puertos (587 de Gmail) aiosmtplib activa STARTTLS si el servidor lo ofrece.
        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_username or None,
            password=settings.smtp_password or None,
            use_tls=settings.smtp_port == 465,
            timeout=20,
        )
    except Exception:
        logger.exception("No se pudo enviar el correo a %s", to)


def _code_html(name: str, intro: str, code: str, minutes: int, outro: str) -> str:
    return f"""\
<div style="background:#FEF7F1;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#553B29">
  <div style="max-width:440px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px 28px;border:1px solid #FBE5D4">
    <p style="margin:0 0 4px;font-size:22px;font-weight:bold;letter-spacing:4px;color:#916646">ECCO</p>
    <p style="margin:20px 0 8px;font-size:16px">Hola {escape(name)},</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.5">{intro}</p>
    <p style="margin:0 auto 20px;padding:14px 0;text-align:center;font-size:34px;font-weight:bold;letter-spacing:10px;background:#F6FAEF;border:1px solid #E4EFCE;border-radius:14px;color:#3B4822">{code}</p>
    <p style="margin:0 0 8px;font-size:14px;color:#6D4D34">El código vence en {minutes} minutos.</p>
    <p style="margin:0;font-size:14px;color:#6D4D34">{outro}</p>
  </div>
</div>"""


async def send_verification_code(to: str, name: str, code: str, minutes: int) -> None:
    text = (
        f"Hola {name},\n\n"
        "Te damos la bienvenida a ECCO. Para confirmar que este correo es tuyo, escribe este código en la app:\n\n"
        f"{code}\n\n"
        f"Vence en {minutes} minutos. Si no creaste una cuenta, puedes ignorar este correo."
    )
    html = _code_html(
        name,
        "Te damos la bienvenida a ECCO. Para confirmar que este correo es tuyo, escribe este código en la app:",
        code,
        minutes,
        "Si no creaste una cuenta, puedes ignorar este correo.",
    )
    await send_email(to, f"{code} es tu código de ECCO", text, html)


async def send_password_reset_code(to: str, name: str, code: str, minutes: int) -> None:
    text = (
        f"Hola {name},\n\n"
        "Recibimos una solicitud para crear una nueva contraseña en ECCO. Escribe este código en la app:\n\n"
        f"{code}\n\n"
        f"Vence en {minutes} minutos. Si no fuiste tú, puedes ignorar este correo: tu cuenta sigue segura."
    )
    html = _code_html(
        name,
        "Recibimos una solicitud para crear una nueva contraseña en ECCO. Escribe este código en la app:",
        code,
        minutes,
        "Si no fuiste tú, puedes ignorar este correo: tu cuenta sigue segura.",
    )
    await send_email(to, f"{code} es tu código para recuperar tu contraseña", text, html)
