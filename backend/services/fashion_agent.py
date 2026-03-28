"""
FashionPromptAgent — Reusable skill-based agent for Poshak Visualizer.
Inspired by hackathon SkillRegistry pattern.
Builds smart HuggingFace prompts using Claude AI.
"""

import os
import logging
from typing import Optional
from anthropic import Anthropic

logger = logging.getLogger(__name__)

# ── Skill Registry Pattern (from hackathon) ──────────────────────────────────

class FashionSkill:
    """A single reusable fashion prompt skill."""
    def __init__(self, name: str, version: str, prompt_template: str, tags: list[str]):
        self.name = name
        self.version = version
        self.prompt_template = prompt_template
        self.tags = tags

class FashionSkillRegistry:
    """
    Lightweight registry for fashion prompt skills.
    Reused from hackathon SkillRegistry pattern.
    """
    def __init__(self):
        self._skills: dict[str, FashionSkill] = {}
        self._register_defaults()

    def _register_defaults(self):
        """Register built-in fashion skills."""
        self.register(FashionSkill(
            name="shalwar-kameez",
            version="1.0.0",
            prompt_template=(
                "beautiful South Asian woman wearing elegant Pakistani shalwar kameez, "
                "long embroidered kurta with churidar trousers, "
                "{dupatta_style}, {embroidery_level} embroidery, {fit_style}, "
                "standing in elegant softly lit studio, "
                "professional fashion photography, photorealistic, 8k, sharp focus"
            ),
            tags=["pakistani", "formal", "traditional"]
        ))
        self.register(FashionSkill(
            name="anarkali",
            version="1.0.0",
            prompt_template=(
                "beautiful South Asian woman wearing stunning anarkali suit, "
                "long flared anarkali dress with churidar, "
                "{dupatta_style}, {embroidery_level} embroidery, {fit_style}, "
                "elegant garden background with soft bokeh, "
                "fashion magazine editorial, photorealistic, 8k ultra detailed"
            ),
            tags=["indian", "formal", "festive"]
        ))
        self.register(FashionSkill(
            name="saree",
            version="1.0.0",
            prompt_template=(
                "beautiful South Asian woman wearing gorgeous silk saree, "
                "gracefully draped pallu with contrast blouse, "
                "{dupatta_style}, {embroidery_level} embroidery, {fit_style}, "
                "elegant indoor setting with marble background, "
                "bridal fashion photography, photorealistic, 8k ultra detailed"
            ),
            tags=["indian", "bridal", "traditional"]
        ))

    def register(self, skill: FashionSkill):
        self._skills[skill.name] = skill
        logger.info(f"Registered fashion skill: {skill.name} v{skill.version}")

    def get(self, name: str) -> Optional[FashionSkill]:
        return self._skills.get(name)

    def list_all(self) -> list[str]:
        return list(self._skills.keys())

# ── Singleton registry ────────────────────────────────────────────────────────
_registry = FashionSkillRegistry()

# ── Fashion Prompt Agent ──────────────────────────────────────────────────────

class FashionPromptAgent:
    """
    AI agent that builds optimized image generation prompts.
    Uses Claude to enhance prompts based on fabric description.
    Falls back to template-based prompts if Claude unavailable.
    """

    DUPATTA_MAP = {
        "draped":  "dupatta elegantly draped over one shoulder",
        "folded":  "dupatta neatly folded over arm",
        "nortan":  "dupatta worn over head as veil",
        "elovr":   "dupatta flowing loosely around shoulders",
    }
    EMBROIDERY_MAP = {
        "light": "subtle light embroidery and delicate threadwork",
        "heavy": "rich heavy embroidery with zari and sequin work",
    }
    FIT_MAP = {
        "regular": "relaxed regular fit",
        "slim":    "tailored slim fit silhouette",
    }

    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        self._client = Anthropic(api_key=api_key) if api_key and api_key != "your_anthropic_key" else None
        if self._client:
            logger.info("FashionPromptAgent: Claude AI enabled")
        else:
            logger.info("FashionPromptAgent: Using template mode (Claude not configured)")

    def build_prompt(
        self,
        style: str,
        dupatta: str,
        embroidery: str,
        fit: str,
        fabric_description: str = "",
    ) -> str:
        """
        Build an optimized image generation prompt.
        Uses Claude if available, otherwise uses skill template.
        """
        skill = _registry.get(style)
        if not skill:
            skill = _registry.get("shalwar-kameez")

        # Fill template
        base_prompt = skill.prompt_template.format(
            dupatta_style=self.DUPATTA_MAP.get(dupatta, self.DUPATTA_MAP["draped"]),
            embroidery_level=self.EMBROIDERY_MAP.get(embroidery, self.EMBROIDERY_MAP["light"]),
            fit_style=self.FIT_MAP.get(fit, self.FIT_MAP["regular"]),
        )

        # Enhance with Claude if available
        if self._client and fabric_description:
            try:
                return self._enhance_with_claude(base_prompt, fabric_description, style)
            except Exception as e:
                logger.warning(f"Claude enhancement failed, using template: {e}")

        return base_prompt

    def _enhance_with_claude(self, base_prompt: str, fabric_description: str, style: str) -> str:
        """Use Claude to enhance the prompt with fabric-specific details."""
        message = self._client.messages.create(
            model="claude-opus-4-5",
            max_tokens=200,
            messages=[{
                "role": "user",
                "content": (
                    f"Enhance this image generation prompt by incorporating the fabric description.\n"
                    f"Base prompt: {base_prompt}\n"
                    f"Fabric: {fabric_description}\n"
                    f"Return ONLY the enhanced prompt, no explanation. Max 100 words."
                )
            }]
        )
        return message.content[0].text.strip()

# ── Singleton agent ───────────────────────────────────────────────────────────
_agent = FashionPromptAgent()

def get_fashion_agent() -> FashionPromptAgent:
    """Get the global FashionPromptAgent instance."""
    return _agent