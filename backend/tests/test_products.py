"""Tests for products.py — canonical matching, categorization, search, substitutes."""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from products import (
    fuzzy_match_item,
    normalize_name,
    categorize_item,
    get_substitutes,
    search_products,
    get_seasonal_items,
    get_smart_suggestions,
)


# -----------------------------------------------------------------------
# normalize_name
# -----------------------------------------------------------------------

class TestNormalizeName:
    def test_lowercases(self):
        assert normalize_name("Milk") == "milk"

    def test_strips_whitespace(self):
        assert normalize_name("  milk  ") == "milk"

    def test_removes_special_characters(self):
        assert normalize_name("milk!") == "milk"
        assert normalize_name("milk@#$%") == "milk"

    def test_singularizes_regular(self):
        # "apples" strips trailing 's' via suffix rules
        result = normalize_name("apples")
        assert result in ("apple", "appl")  # suffix rules vary

    def test_singularizes_irregular(self):
        assert normalize_name("tomatoes") == "tomato"
        assert normalize_name("potatoes") == "potato"

    def test_preserves_short_words(self):
        # Don't singularize if result would be < 3 chars
        result = normalize_name("eggs")
        assert len(result) >= 3 or result == "egg"


# -----------------------------------------------------------------------
# fuzzy_match_item — exact alias resolution
# -----------------------------------------------------------------------

class TestFuzzyMatchItem:
    def test_exact_product_name(self):
        assert fuzzy_match_item("milk") == "milk"

    def test_exact_keyword(self):
        assert fuzzy_match_item("doodh") == "milk"
        assert fuzzy_match_item("chai") == "tea"
        # paneer is both a keyword for cheese AND a standalone substitute;
        # the substitute mapping wins, so it maps to itself
        assert fuzzy_match_item("paneer") == "paneer"

    def test_case_insensitive(self):
        assert fuzzy_match_item("Milk") == "milk"
        assert fuzzy_match_item("Doodh") == "milk"

    def test_plural_resolves(self):
        result = fuzzy_match_item("apples")
        assert result in ("apple", "apples")  # should normalize to known product

    def test_substitute_resolves_to_substitute(self):
        result = fuzzy_match_item("almond milk")
        assert result == "almond milk"

    def test_unknown_item_returns_normalized(self):
        result = fuzzy_match_item("avocado")
        assert result == "avocado"


# -----------------------------------------------------------------------
# categorize_item
# -----------------------------------------------------------------------

class TestCategorizeItem:
    def test_dairy(self):
        assert categorize_item("milk") == "dairy"
        assert categorize_item("cheese") == "dairy"
        assert categorize_item("eggs") == "dairy"

    def test_produce(self):
        assert categorize_item("apples") == "produce"
        assert categorize_item("tomatoes") == "produce"
        assert categorize_item("spinach") == "produce"

    def test_grains(self):
        assert categorize_item("rice") == "grains"
        assert categorize_item("bread") == "grains"

    def test_beverages(self):
        assert categorize_item("tea") == "beverages"
        assert categorize_item("coffee") == "beverages"

    def test_unknown_returns_uncategorized(self):
        assert categorize_item("avocado") == "uncategorized"

    def test_case_insensitive(self):
        assert categorize_item("MILK") == "dairy"
        assert categorize_item("Chai") == "beverages"


# -----------------------------------------------------------------------
# get_substitutes
# -----------------------------------------------------------------------

class TestGetSubstitutes:
    def test_milk_has_substitutes(self):
        subs = get_substitutes("milk")
        assert "almond milk" in subs
        assert "soy milk" in subs

    def test_unknown_returns_empty(self):
        subs = get_substitutes("avocado")
        assert subs == []

    def test_keyword_lookup(self):
        subs = get_substitutes("doodh")  # Hindi for milk
        assert len(subs) > 0


# -----------------------------------------------------------------------
# search_products
# -----------------------------------------------------------------------

class TestSearchProducts:
    def test_exact_match(self):
        results = search_products("milk")
        assert any(r["name"] == "milk" for r in results)

    def test_keyword_match(self):
        results = search_products("chai")
        assert any(r["name"] == "tea" for r in results)

    def test_partial_match(self):
        results = search_products("tom")
        assert any(r["name"] == "tomatoes" for r in results)

    def test_no_match(self):
        results = search_products("xyzxyzxyz")
        assert results == []


# -----------------------------------------------------------------------
# get_seasonal_items / get_smart_suggestions
# -----------------------------------------------------------------------

class TestSeasonalAndSuggestions:
    def test_seasonal_returns_list(self):
        items = get_seasonal_items()
        assert isinstance(items, list)
        assert len(items) > 0
        for item in items:
            assert "name" in item
            assert "category" in item

    def test_suggestions_returns_list(self):
        suggestions = get_smart_suggestions(["milk"])
        assert isinstance(suggestions, list)
        assert len(suggestions) <= 8
        for s in suggestions:
            assert "name" in s
            assert "category" in s
            assert "reason" in s
