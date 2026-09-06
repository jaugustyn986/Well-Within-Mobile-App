from __future__ import annotations

from pathlib import Path
from typing import Sequence

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt

import build_clinical_review_packet as base


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "Well_Within_Practitioner_Confirmation_Brief_AI_Recommended.docx"
DATE = "July 13, 2026"

# decision_memo preset (standard_business_brief) with two named overrides:
# 1) Well Within muted rose/charcoal brand palette.
# 2) practitioner_leave_behind_density: 10 pt recommendation text to keep the
#    eight decisions and source list readable within the requested two pages.
base.FONT = "Arial"

INK = "3E3533"
MUTED = "6F6663"
ACCENT = "A96F68"
ACCENT_DARK = "754B47"
PALE_ROSE = "F5EAE7"
PALE_SAGE = "EAF1ED"
PALE_GOLD = "F6F0DD"
LIGHT_GRAY = "F3F1F0"
BORDER = "D8CFCC"


SOURCES = (
    (
        "1",
        "Saint Paul VI Institute. CrMS App Copyright public sample (2019), p. 3.",
        "https://saintpaulvi.com/PDF/CrMS_App_Copyright.pdf",
    ),
    (
        "2",
        "Creighton Model FertilityCare System. Background (public overview).",
        "https://creightonmodel.com/background/",
    ),
    (
        "3",
        "Stanford JB et al. Paediatr Perinat Epidemiol. 2020;34:105-113. doi:10.1111/ppe.12642.",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC8495767/",
    ),
    (
        "4",
        "Najmabadi S et al. Hum Reprod. 2021;36:1784-1795. doi:10.1093/humrep/deab049.",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC8487651/",
    ),
    (
        "5",
        "CDC. U.S. MEC Appendix F: Fertility Awareness-Based Methods.",
        "https://www.cdc.gov/contraception/hcp/usmec/fertility-awareness-based-methods.html",
    ),
)


RECOMMENDATIONS = (
    (
        "1",
        "Supported first-release scope",
        (
            "Keep charting and observation export available to every user.",
            "Provide an automated retrospective Peak summary only when the chart has complete dated observations, an eligible Cycle Day 1 boundary, and one clear Peak-type sequence.",
            "This release does not screen for or add alternate rules for postpartum/breastfeeding, perimenopause, recent hormonal contraception, relevant medication effects, persistent discharge, or suspected infection. It names these contexts as unsupported and not accounted for beside every exact result.",
            "Continue to withhold exact boundaries for detectable unsupported states such as unusual bleeding with mucus, continuous mucus, an unresolved later Peak-type candidate, invalid dates, or another unresolved pattern.",
            "Do not forecast a future fertile window or provide avoiding-pregnancy, conception-timing, diagnostic, or ovulation-confirmation guidance. A restricted retrospective Possible fertile pattern may be shown only under recommendations 4-7.",
        ),
    ),
    (
        "2",
        "Daily observations and input validity",
        (
            "Store and display the original bleeding, sensation, appearance, frequency, and notes; never replace the source observations with a reduced value.",
            "For the broad app classification, treat clear, stretchy, or lubricative/slippery as Peak-type; otherwise classify the day only as lower-quality mucus or dry/no mucus. Damp, wet, or shiny alone should not be promoted to Peak-type.",
            "If several observations occur, the strongest supported feature may drive the broad class, but all details remain visible. A contradictory entry, such as dry plus a Peak-type appearance, must be corrected or excluded from automation rather than silently promoted.",
            "Require a valid date and one daily record. Merge same-day entries, sort out-of-order entries by date, and allow missing frequency for broad classification only; do not generate official-looking CrMS notation from incomplete fields.",
        ),
    ),
    (
        "3",
        "Cycle Day 1 and bleeding plus mucus",
        (
            "Cycle Day 1 is the first day the user identifies as true menstrual flow, not isolated spotting or brown discharge. Ask only when potentially leading light flow is recorded. A clear moderate/heavy start may establish the boundary automatically.",
            "For leading light, Yes anchors Day 1 to that date; No permits a later unambiguous moderate/heavy boundary; I'm not sure or no answer keeps exact dates withheld without blocking charting.",
            "Allow mucus observations on every bleeding day. Heavy/moderate flow days are not automated Peak candidates.",
            "If a Peak-type sign is recorded with light/very-light flow or spotting, preserve it and route the chart to review; do not automatically select that day as Peak in the first release.",
        ),
    ),
    (
        "4",
        "Peak-type, possible Peak, and retrospective Peak",
        (
            "A Peak-type day contains a clear, stretchy, or lubricative/slippery observation. The most recent Peak-type day is only a possible Peak while later observations are incomplete.",
            "Mark Peak Day retrospectively only after the next three consecutive calendar days are present, observed, and contain no Peak-type sign. A later Peak-type sign resets the possible Peak to the later day.",
            "Do not require a numeric step-down relationship among P+1, P+2, and P+3; require only three consecutive observed non-Peak-type days.",
            "For an eligible simple chart, P+3 may be the displayed 'through' date of a Possible fertile pattern. It must not be presented as confirmed ovulation, biological fertility ending, or an infertile/safe-day boundary.",
        ),
    ),
    (
        "5",
        "Gaps, not-observed days, and past edits",
        (
            "Treat an absent date and an explicit not-observed day the same for automation when either falls from the possible Peak through P+3: do not confirm Peak.",
            "An earlier gap does not erase the chart, but it prevents claims about a complete pattern boundary and makes that cycle ineligible for history comparisons.",
            "Past edits recalculate the Peak marker, plus-count, pattern eligibility, and history. Later non-Peak mucus stays visible without reopening a completed presentation; a later Peak-type sign supersedes it and starts a new three-day follow-up.",
        ),
    ),
    (
        "6",
        "Repeated, continuous, BIP-like, and special-context charts",
        (
            "A later Peak-type sign becomes the active possible Peak; keep the earlier sign visible as an observation. Hide the derived Peak/P+ display until the new three-day follow-up completes, then display the later qualifying sequence.",
            "For continuous Peak-type mucus, continuous lower-quality mucus, non-Peak-only patterns, or a possible Basic Infertile Pattern, provide charting only; do not invent a Peak or BIP.",
            "For every special context, keep charting/editing/export available and recommend qualified support without locking or unlocking the app. Because these contexts are not collected in this release, Help states that a date may still appear and has not accounted for the context.",
        ),
    ),
    (
        "7",
        "Ordinary-user terminology and Possible fertile pattern",
        (
            "Use: 'Peak-type observation based on what you recorded,' 'possible Peak Day,' 'Peak Day based on your chart,' 'P+1/P+2/P+3,' and 'Possible fertile pattern — based on your logged observations.'",
            "While mucus signs are present and the chart is still forming, say only that a possible pattern may be developing; show no start/end dates or band. For an eligible simple chart after P+3, show the first approved mucus observation through P+3.",
            "Place this limitation beside exact dates: 'This chart-based estimate does not confirm ovulation, identify safe or infertile days, predict pregnancy, or provide pregnancy-avoidance guidance. Special contexts—including postpartum or breastfeeding, perimenopause, recent hormones, relevant medication effects, and persistent discharge—are not supported or accounted for in this first release.'",
            "Do not use: definitive fertile window, fertile/infertile day, safe day, Fertile Start/End, Total fertile days, past/closed window, confirmed ovulation, most fertile day confirmed, confidence scores, diagnosis, pregnancy prediction, or future fertile-window shading.",
            "Do not describe Well Within as Creighton-certified, affiliated, licensed, or clinically validated unless separate evidence actually establishes that status.",
        ),
    ),
    (
        "8",
        "History eligibility and comparisons",
        (
            "Include only completed cycles with an eligible Cycle Day 1, full date coverage through P+3, one currently marked Peak, no unresolved contradiction, and no later Peak-type candidate still awaiting its three-day follow-up.",
            "Require at least three eligible completed cycles before showing history comparisons. This is a conservative product threshold, not a clinical norm.",
            "Show raw dates plus median and range only. A permitted example is: 'Across N eligible completed cycles, the first recorded mucus sign occurred on Cycle Days X-Y, and the Peak marker occurred on A-B.' Do not label the pattern usual, expected, normal, abnormal, or predict the active cycle.",
            "Before release, have the practitioner independently mark a de-identified conformance set spanning standard, bleeding-plus-mucus, gap, repeated, continuous, and special-context cases. Treat this as rule conformance, not clinical validation.",
        ),
    ),
)


def configure_styles(doc: Document) -> tuple[int, int]:
    base.configure_styles(doc)
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.60)
    section.bottom_margin = Inches(0.55)
    section.left_margin = Inches(0.78)
    section.right_margin = Inches(0.78)
    section.header_distance = Inches(0.34)
    section.footer_distance = Inches(0.34)
    section.different_first_page_header_footer = True

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(10.25)
    normal.font.color.rgb = base.rgb(INK)
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.space_after = Pt(4)
    normal.paragraph_format.line_spacing = 1.08

    for level, size, before, after in (
        (1, 16, 12, 6),
        (2, 11.2, 6, 2.5),
        (3, 10.5, 5, 2),
    ):
        style = styles[f"Heading {level}"]
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = base.rgb(ACCENT_DARK if level != 2 else ACCENT)
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True

    styles["Small Note"].font.name = "Arial"
    styles["Small Note"]._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    styles["Small Note"]._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    styles["Small Note"].font.size = Pt(7.4)
    styles["Small Note"].font.color.rgb = base.rgb(MUTED)
    styles["Small Note"].paragraph_format.space_after = Pt(2)
    styles["Small Note"].paragraph_format.line_spacing = 1.02

    doc.core_properties.title = "Well Within Practitioner Confirmation Brief - AI Recommended"
    doc.core_properties.subject = "Concrete interim product rules for qualified practitioner confirmation"
    doc.core_properties.author = "Well Within - AI Recommended Draft"
    doc.core_properties.comments = (
        "Independent conservative product recommendations. Not a claim of official CrMS rules, "
        "clinical validation, affiliation, license, or legal/regulatory approval."
    )
    return base.add_numbering(doc)


def set_header_footer(doc: Document) -> None:
    section = doc.sections[0]
    header = section.header
    p = header.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("WELL WITHIN  |  PRACTITIONER CONFIRMATION BRIEF")
    base.set_font(r, size=8.0, color=MUTED, bold=True)

    footer = section.footer
    table = footer.add_table(rows=1, cols=2, width=Inches(6.5))
    base.set_table_geometry(table, [7650, 1710], indent_dxa=0)
    left, right = table.rows[0].cells
    p = left.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run("AI-recommended interim rules | Practitioner confirmation requested | Not method or license approval")
    base.set_font(r, size=7.2, color=MUTED)
    base.add_page_field(right.paragraphs[0])

    first_footer = section.first_page_footer
    p = first_footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Well Within | AI-recommended interim product rules | Practitioner confirmation requested")
    base.set_font(r, size=7.3, color=MUTED)


def add_callout(doc: Document, label: str, text: str, fill: str) -> None:
    table = doc.add_table(rows=1, cols=1)
    base.set_table_geometry(table, [base.PAGE_WIDTH_DXA])
    base.set_table_borders(table, color=fill, size="2")
    base.set_row_cant_split(table.rows[0])
    cell = table.cell(0, 0)
    base.set_cell_shading(cell, fill)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.06
    r = p.add_run(label + "  ")
    base.set_font(r, size=9.4, color=ACCENT_DARK, bold=True)
    r = p.add_run(text)
    base.set_font(r, size=9.4, color=INK)
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(1)


def add_title_block(doc: Document) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("AI-RECOMMENDED INTERIM PRODUCT RULES")
    base.set_font(r, size=9.2, color=ACCENT, bold=True)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    r = p.add_run("Well Within Practitioner Confirmation Brief")
    base.set_font(r, size=22, color=ACCENT_DARK, bold=True)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run("Concrete first-release recommendations, including the Possible fertile pattern enhancement")
    base.set_font(r, size=11.5, color=MUTED, italic=True)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(7)
    r = p.add_run(f"Prepared: {DATE}   |   Working assumption: prior recommendations accepted; confirm or revise this consolidated set")
    base.set_font(r, size=8.4, color=MUTED, bold=True)

    add_callout(
        doc,
        "What we need / boundary",
        "The product owner asked Action 5 to proceed on the assumption that the prior interim rules were accepted, including a qualified Possible fertile pattern and the Cycle Day 1 behavior below. Engineering has implemented this scope. Please identify only what is clinically unsafe or materially inaccurate. These are independent Well Within product rules, not a complete or authorized Creighton specification or evidence of certification, affiliation, licensing, product-specific clinical validation, or legal/regulatory approval.",
        PALE_SAGE,
    )


def add_bullet(doc: Document, text: str, bullet_id: int) -> None:
    p = doc.add_paragraph()
    base.apply_num(p, bullet_id)
    p.paragraph_format.space_after = Pt(1.2)
    p.paragraph_format.line_spacing = 1.02
    r = p.add_run(text)
    base.set_font(r, size=9.2, color=INK)


def add_recommendation(doc: Document, number: str, title: str, bullets: Sequence[str], bullet_id: int) -> None:
    p = doc.add_paragraph(style="Heading 2")
    p.paragraph_format.keep_with_next = True
    r = p.add_run(f"{number}. {title}")
    base.set_font(r, size=11.2, color=ACCENT_DARK, bold=True)
    for item in bullets:
        add_bullet(doc, item, bullet_id)


def add_sources(doc: Document) -> None:
    p = doc.add_paragraph(style="Heading 2")
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run("Public evidence used")
    base.set_font(r, size=11.5, color=ACCENT_DARK, bold=True)
    p = doc.add_paragraph(style="Small Note")
    p.paragraph_format.left_indent = Inches(0)
    p.paragraph_format.first_line_indent = Inches(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.0
    for index, (key, citation, url) in enumerate(SOURCES):
        if index > 0:
            sep = p.add_run("\n")
            base.set_font(sep, size=7.1, color=MUTED)
        r = p.add_run(f"[{key}] ")
        base.set_font(r, size=7.1, color=ACCENT_DARK, bold=True)
        base.add_hyperlink(p, citation, url)


def add_final_request(doc: Document) -> None:
    add_callout(
        doc,
        "Fastest useful response",
        "Overall: [ ] No material clinical objection  [ ] Corrections attached. If acceptable, write 'No material clinical objection to the consolidated interim rule set, including Possible fertile pattern.' Separate legal, licensing, trademark, privacy, regulatory, and claim review remains required.",
        PALE_ROSE,
    )


def build() -> Path:
    doc = Document()
    bullet_id, _ = configure_styles(doc)
    set_header_footer(doc)
    add_title_block(doc)

    for number, title, bullets in RECOMMENDATIONS[:4]:
        add_recommendation(doc, number, title, bullets, bullet_id)

    doc.add_page_break()
    p = doc.add_paragraph(style="Heading 1")
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run("Recommendations continued")
    base.set_font(r, size=16, color=ACCENT_DARK, bold=True)
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(5)
    r = p.add_run("The practitioner may accept these as conservative interim product rules or specify the smallest required clinical correction.")
    base.set_font(r, size=9.2, color=MUTED, italic=True)

    for number, title, bullets in RECOMMENDATIONS[4:]:
        add_recommendation(doc, number, title, bullets, bullet_id)

    add_final_request(doc)
    add_sources(doc)

    doc.save(OUTPUT)
    return OUTPUT


if __name__ == "__main__":
    print(build())
