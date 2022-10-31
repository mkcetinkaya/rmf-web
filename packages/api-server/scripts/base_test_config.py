import os

from api_server.default_config import config

here = os.path.dirname(__file__)

test_port = os.environ.get("RMF_SERVER_TEST_PORT", "31080")
config.update(
    {
        "host": "157.90.235.4",
        "port": int(test_port),
        "log_level": "CRITICAL",
        "jwt_public_key": f"{here}/test.pub",
        "iss": "test",
    }
)
