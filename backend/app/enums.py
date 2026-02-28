from enum import Enum


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"


class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"
    LIGHT = "light"
    MODERATE = "moderate"
    HIGH = "high"


class Goal(str, Enum):
    MAINTAIN = "maintain"
    LOSE_FAT = "lose_fat"
    GAIN_MASS = "gain_mass"
