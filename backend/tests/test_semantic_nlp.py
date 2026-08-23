"""Tests for semantic_nlp.py — intent classification, quantity extraction, parsing."""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from semantic_nlp import (
    classify_intent,
    extract_quantity,
    clean_item_name,
    split_items_from_text,
    parse_voice_command_local,
)


# -----------------------------------------------------------------------
# classify_intent
# -----------------------------------------------------------------------

class TestClassifyIntent:
    def test_add_with_keyword(self):
        result = classify_intent("add milk to my list")
        assert result["intent"] == "add"
        assert result["ambiguity"] in ("none", "low")

    def test_add_i_need(self):
        result = classify_intent("i need apples")
        assert result["intent"] == "add"

    def test_add_buy(self):
        result = classify_intent("buy some bread")
        assert result["intent"] == "add"

    def test_remove_delete(self):
        result = classify_intent("delete milk")
        assert result["intent"] == "remove"

    def test_remove_i_dont_need(self):
        result = classify_intent("i don't need milk anymore")
        assert result["intent"] == "remove"

    def test_remove_nevermind(self):
        result = classify_intent("nevermind about bread")
        assert result["intent"] == "remove"

    def test_search_find(self):
        result = classify_intent("find me some tea")
        assert result["intent"] == "search"

    def test_search_look_for(self):
        result = classify_intent("look for organic apples")
        assert result["intent"] == "search"

    def test_single_word_defaults_to_add(self):
        result = classify_intent("milk")
        assert result["intent"] == "add"
        assert result["ambiguity"] in ("low", "high")

    def test_two_words_defaults_to_add(self):
        result = classify_intent("green tea")
        assert result["intent"] == "add"

    def test_negation_overrides_add_signal(self):
        # "don't forget milk" is add, but "don't need milk" is remove
        result_add = classify_intent("don't forget milk")
        assert result_add["intent"] == "add"

        result_remove = classify_intent("don't need milk")
        assert result_remove["intent"] == "remove"


# -----------------------------------------------------------------------
# extract_quantity
# -----------------------------------------------------------------------

class TestExtractQuantity:
    def test_digit_quantity(self):
        name, qty = extract_quantity("2 bottles of milk")
        assert qty == 2
        assert "milk" in name

    def test_word_quantity(self):
        name, qty = extract_quantity("two apples")
        assert qty == 2
        assert "apples" in name

    def test_default_quantity(self):
        name, qty = extract_quantity("milk")
        assert qty == 1

    def test_dozen(self):
        name, qty = extract_quantity("a dozen eggs")
        assert qty == 12

    def test_removes_unit_labels(self):
        name, qty = extract_quantity("3 kg rice")
        assert qty == 3
        assert "rice" in name

    def test_no_quantity(self):
        name, qty = extract_quantity("bread")
        assert qty == 1


# -----------------------------------------------------------------------
# clean_item_name
# -----------------------------------------------------------------------

class TestCleanItemName:
    def test_strips_stopwords(self):
        result = clean_item_name("add some milk to my list")
        assert "add" not in result
        assert "some" not in result
        assert "milk" in result

    def test_strips_punctuation(self):
        result = clean_item_name("milk!")
        assert result == "milk"

    def test_preserves_item_name(self):
        result = clean_item_name("green tea")
        assert "green" in result
        assert "tea" in result


# -----------------------------------------------------------------------
# split_items_from_text
# -----------------------------------------------------------------------

class TestSplitItems:
    def test_comma_separated(self):
        parts = split_items_from_text("milk, bread, eggs")
        assert len(parts) == 3

    def test_and_separated(self):
        parts = split_items_from_text("milk and bread and eggs")
        assert len(parts) == 3

    def test_mixed_separators(self):
        parts = split_items_from_text("milk, bread and eggs")
        assert len(parts) == 3

    def test_single_item(self):
        parts = split_items_from_text("milk")
        assert len(parts) == 1


# -----------------------------------------------------------------------
# parse_voice_command_local (integration of the above)
# -----------------------------------------------------------------------

class TestParseVoiceCommandLocal:
    def test_add_single_item(self):
        result = parse_voice_command_local("add milk")
        assert result["action"] == "add"
        assert len(result["items"]) >= 1
        assert result["items"][0]["name"] == "milk"

    def test_add_with_quantity(self):
        result = parse_voice_command_local("add 2 bottles of water")
        assert result["action"] == "add"
        assert result["items"][0]["quantity"] == 2
        assert "water" in result["items"][0]["name"]

    def test_remove_item(self):
        result = parse_voice_command_local("remove bread from my list")
        assert result["action"] == "remove"
        assert any("bread" in item["name"] for item in result["items"])

    def test_search_item(self):
        result = parse_voice_command_local("find organic apples")
        assert result["action"] == "search"

    def test_multi_item_add(self):
        result = parse_voice_command_local("add milk, bread and eggs")
        assert result["action"] == "add"
        assert len(result["items"]) == 3

    def test_single_word_ambiguity(self):
        result = parse_voice_command_local("milk")
        assert result["action"] == "add"
        assert result["ambiguity"] in ("low", "high")

    def test_result_has_required_fields(self):
        result = parse_voice_command_local("add milk")
        assert "action" in result
        assert "items" in result
        assert "confidence" in result
        assert "ambiguity" in result
        assert "source" in result
        assert "raw_transcript" in result

    def test_negation_flip(self):
        result = parse_voice_command_local("i don't need milk")
        assert result["action"] == "remove"

    def test_hindi_keyword(self):
        result = parse_voice_command_local("doodh chahiye")
        # Should detect as add (milk in Hindi)
        assert result["action"] == "add"
