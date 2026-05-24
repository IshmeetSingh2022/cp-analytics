# Import all models here so SQLAlchemy's Base registers them
# before create_all() is called.

from app.models.user import User  # noqa: F401
from app.models.submission import Submission  # noqa: F401
from app.models.problems import Problem  # noqa: F401
from app.models.ratings import UserRating  # noqa: F401
from app.models.daily_stats import DailyStats  # noqa: F401
from app.models.user_topic_stats import UserTopicStats  # noqa: F401
