# Reporting microservice (demo fixture).
# Dependency pins in requirements.txt are intentionally old so that
# VulnIntel's scanner returns reproducible findings. Do not deploy.
import yaml
import requests
import paramiko
from jinja2 import Template
from flask import Flask

app = Flask(__name__)


def fetch_orders(api_base, token):
    resp = requests.get(f"{api_base}/orders", headers={"Authorization": token},
                        timeout=10)
    resp.raise_for_status()
    return resp.json()


def load_config(path):
    with open(path) as fh:
        return yaml.safe_load(fh)


def render_summary(orders):
    tpl = Template("<h1>{{ total }} orders today</h1>")
    return tpl.render(total=len(orders))


def upload_report(host, user, local_path):
    client = paramiko.SSHClient()
    client.connect(host, username=user)
    sftp = client.open_sftp()
    sftp.put(local_path, f"/reports/{local_path}")
    sftp.close()
    client.close()
