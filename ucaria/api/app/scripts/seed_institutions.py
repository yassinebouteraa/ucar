"""Seed the Supabase database with demo institutions, KPI snapshots, and alerts.

Based on the 4 institutions described in UCAR_PULSE_DOCUMENTATION.md.
All operations are idempotent (ON CONFLICT DO NOTHING).

Usage:
    python -m app.scripts.seed_institutions
    # or inside Docker:
    docker compose exec api python -m app.scripts.seed_institutions
"""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone

from app.db.conn import get_conn, is_postgres

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger("echogarden.seed")


# ── Institution definitions ───────────────────────────────

INSTITUTIONS = [
    {
        "id": "inst-insat-001",
        "name": "INSAT — Institut National des Sciences Appliquées et de Technologie",
        "slug": "insat",
        "type": "engineering",
        "city": "Tunis",
    },
    {
        "id": "inst-enit-002",
        "name": "ENIT — École Nationale d'Ingénieurs de Tunis",
        "slug": "enit",
        "type": "engineering",
        "city": "Tunis",
    },
    {
        "id": "inst-esprit-003",
        "name": "ESPRIT — École Supérieure Privée d'Ingénierie et de Technologies",
        "slug": "esprit",
        "type": "engineering",
        "city": "Tunis",
    },
    {
        "id": "inst-isg-004",
        "name": "ISG — Institut Supérieur de Gestion de Tunis",
        "slug": "isg",
        "type": "business",
        "city": "Tunis",
    },
]


# ── KPI snapshot data (3 semesters per institution) ───────

KPI_DATA = {
    "inst-insat-001": [
        {
            "period": "2023-S2",
            "data": {
                "academic": {"success_rate": 0.81, "attendance_rate": 0.88, "dropout_rate": 0.19, "repetition_rate": 0.12, "exam_pass_rate": 0.78},
                "finance": {"budget_allocated": 2400000, "budget_used": 2184000, "budget_execution_rate": 0.91, "cost_per_student": 1850},
                "employment": {"employability_rate": 0.72, "insertion_delay_months": 6, "national_partnership_rate": 0.50},
                "hr": {"teaching_staff_count": 155, "admin_staff_count": 40, "absenteeism_rate": 0.03, "training_completed_rate": 0.65},
                "research": {"publications_count": 28, "active_projects": 10, "funding_secured": 200000, "patents_filed": 3},
                "infrastructure": {"classroom_occupancy_rate": 0.82, "it_equipment_ok_rate": 0.93, "ongoing_works": 2},
                "esg": {"energy_consumption_kwh": 140000, "recycling_rate": 0.14, "green_mobility_rate": 0.09},
                "partnerships": {"active_agreements": 16, "outgoing_mobility": 25, "incoming_mobility": 13, "international_projects": 5},
            },
        },
        {
            "period": "2024-S1",
            "data": {
                "academic": {"success_rate": 0.76, "attendance_rate": 0.79, "dropout_rate": 0.24, "repetition_rate": 0.14, "exam_pass_rate": 0.73},
                "finance": {"budget_allocated": 2400000, "budget_used": 2160000, "budget_execution_rate": 0.90, "cost_per_student": 1870},
                "employment": {"employability_rate": 0.70, "insertion_delay_months": 7, "national_partnership_rate": 0.47},
                "hr": {"teaching_staff_count": 150, "admin_staff_count": 39, "absenteeism_rate": 0.04, "training_completed_rate": 0.60},
                "research": {"publications_count": 25, "active_projects": 9, "funding_secured": 185000, "patents_filed": 2},
                "infrastructure": {"classroom_occupancy_rate": 0.85, "it_equipment_ok_rate": 0.90, "ongoing_works": 3},
                "esg": {"energy_consumption_kwh": 142000, "recycling_rate": 0.13, "green_mobility_rate": 0.08},
                "partnerships": {"active_agreements": 15, "outgoing_mobility": 22, "incoming_mobility": 12, "international_projects": 4},
            },
        },
        {
            "period": "2024-S2",
            "data": {
                "academic": {"success_rate": 0.72, "attendance_rate": 0.71, "dropout_rate": 0.28, "repetition_rate": 0.15, "exam_pass_rate": 0.69},
                "finance": {"budget_allocated": 2400000, "budget_used": 2184000, "budget_execution_rate": 0.91, "cost_per_student": 1850},
                "employment": {"employability_rate": 0.68, "insertion_delay_months": 7, "national_partnership_rate": 0.45},
                "hr": {"teaching_staff_count": 142, "admin_staff_count": 38, "absenteeism_rate": 0.04, "training_completed_rate": 0.61},
                "research": {"publications_count": 23, "active_projects": 8, "funding_secured": 180000, "patents_filed": 2},
                "infrastructure": {"classroom_occupancy_rate": 0.87, "it_equipment_ok_rate": 0.91, "ongoing_works": 3},
                "esg": {"energy_consumption_kwh": 142000, "recycling_rate": 0.12, "green_mobility_rate": 0.08},
                "partnerships": {"active_agreements": 14, "outgoing_mobility": 23, "incoming_mobility": 11, "international_projects": 4},
            },
        },
    ],
    "inst-enit-002": [
        {
            "period": "2023-S2",
            "data": {
                "academic": {"success_rate": 0.83, "attendance_rate": 0.86, "dropout_rate": 0.12, "repetition_rate": 0.10, "exam_pass_rate": 0.80},
                "finance": {"budget_allocated": 3000000, "budget_used": 1800000, "budget_execution_rate": 0.60, "cost_per_student": 2100},
                "employment": {"employability_rate": 0.75, "insertion_delay_months": 5, "national_partnership_rate": 0.55},
                "hr": {"teaching_staff_count": 170, "admin_staff_count": 45, "absenteeism_rate": 0.03, "training_completed_rate": 0.70},
                "research": {"publications_count": 35, "active_projects": 12, "funding_secured": 250000, "patents_filed": 4},
                "infrastructure": {"classroom_occupancy_rate": 0.78, "it_equipment_ok_rate": 0.75, "ongoing_works": 1},
                "esg": {"energy_consumption_kwh": 160000, "recycling_rate": 0.16, "green_mobility_rate": 0.11},
                "partnerships": {"active_agreements": 18, "outgoing_mobility": 30, "incoming_mobility": 15, "international_projects": 6},
            },
        },
        {
            "period": "2024-S1",
            "data": {
                "academic": {"success_rate": 0.84, "attendance_rate": 0.87, "dropout_rate": 0.11, "repetition_rate": 0.09, "exam_pass_rate": 0.81},
                "finance": {"budget_allocated": 3000000, "budget_used": 1560000, "budget_execution_rate": 0.52, "cost_per_student": 2050},
                "employment": {"employability_rate": 0.76, "insertion_delay_months": 5, "national_partnership_rate": 0.56},
                "hr": {"teaching_staff_count": 168, "admin_staff_count": 44, "absenteeism_rate": 0.03, "training_completed_rate": 0.72},
                "research": {"publications_count": 33, "active_projects": 11, "funding_secured": 240000, "patents_filed": 3},
                "infrastructure": {"classroom_occupancy_rate": 0.80, "it_equipment_ok_rate": 0.68, "ongoing_works": 0},
                "esg": {"energy_consumption_kwh": 158000, "recycling_rate": 0.15, "green_mobility_rate": 0.10},
                "partnerships": {"active_agreements": 17, "outgoing_mobility": 28, "incoming_mobility": 14, "international_projects": 5},
            },
        },
        {
            "period": "2024-S2",
            "data": {
                "academic": {"success_rate": 0.84, "attendance_rate": 0.88, "dropout_rate": 0.11, "repetition_rate": 0.09, "exam_pass_rate": 0.82},
                "finance": {"budget_allocated": 3000000, "budget_used": 1410000, "budget_execution_rate": 0.47, "cost_per_student": 2000},
                "employment": {"employability_rate": 0.77, "insertion_delay_months": 5, "national_partnership_rate": 0.57},
                "hr": {"teaching_staff_count": 165, "admin_staff_count": 43, "absenteeism_rate": 0.02, "training_completed_rate": 0.73},
                "research": {"publications_count": 32, "active_projects": 10, "funding_secured": 230000, "patents_filed": 3},
                "infrastructure": {"classroom_occupancy_rate": 0.81, "it_equipment_ok_rate": 0.61, "ongoing_works": 0},
                "esg": {"energy_consumption_kwh": 155000, "recycling_rate": 0.15, "green_mobility_rate": 0.10},
                "partnerships": {"active_agreements": 17, "outgoing_mobility": 27, "incoming_mobility": 13, "international_projects": 5},
            },
        },
    ],
    "inst-esprit-003": [
        {
            "period": "2023-S2",
            "data": {
                "academic": {"success_rate": 0.86, "attendance_rate": 0.92, "dropout_rate": 0.08, "repetition_rate": 0.07, "exam_pass_rate": 0.84},
                "finance": {"budget_allocated": 5000000, "budget_used": 4400000, "budget_execution_rate": 0.88, "cost_per_student": 3200},
                "employment": {"employability_rate": 0.82, "insertion_delay_months": 4, "national_partnership_rate": 0.62},
                "hr": {"teaching_staff_count": 200, "admin_staff_count": 55, "absenteeism_rate": 0.02, "training_completed_rate": 0.80},
                "research": {"publications_count": 38, "active_projects": 15, "funding_secured": 320000, "patents_filed": 5},
                "infrastructure": {"classroom_occupancy_rate": 0.90, "it_equipment_ok_rate": 0.95, "ongoing_works": 2},
                "esg": {"energy_consumption_kwh": 180000, "recycling_rate": 0.20, "green_mobility_rate": 0.15},
                "partnerships": {"active_agreements": 22, "outgoing_mobility": 35, "incoming_mobility": 18, "international_projects": 8},
            },
        },
        {
            "period": "2024-S1",
            "data": {
                "academic": {"success_rate": 0.87, "attendance_rate": 0.91, "dropout_rate": 0.07, "repetition_rate": 0.06, "exam_pass_rate": 0.85},
                "finance": {"budget_allocated": 5200000, "budget_used": 4576000, "budget_execution_rate": 0.88, "cost_per_student": 3250},
                "employment": {"employability_rate": 0.83, "insertion_delay_months": 4, "national_partnership_rate": 0.63},
                "hr": {"teaching_staff_count": 205, "admin_staff_count": 56, "absenteeism_rate": 0.02, "training_completed_rate": 0.82},
                "research": {"publications_count": 40, "active_projects": 16, "funding_secured": 340000, "patents_filed": 5},
                "infrastructure": {"classroom_occupancy_rate": 0.91, "it_equipment_ok_rate": 0.96, "ongoing_works": 1},
                "esg": {"energy_consumption_kwh": 175000, "recycling_rate": 0.22, "green_mobility_rate": 0.16},
                "partnerships": {"active_agreements": 23, "outgoing_mobility": 37, "incoming_mobility": 19, "international_projects": 9},
            },
        },
        {
            "period": "2024-S2",
            "data": {
                "academic": {"success_rate": 0.88, "attendance_rate": 0.93, "dropout_rate": 0.06, "repetition_rate": 0.06, "exam_pass_rate": 0.86},
                "finance": {"budget_allocated": 5500000, "budget_used": 4895000, "budget_execution_rate": 0.89, "cost_per_student": 3300},
                "employment": {"employability_rate": 0.84, "insertion_delay_months": 3, "national_partnership_rate": 0.65},
                "hr": {"teaching_staff_count": 210, "admin_staff_count": 58, "absenteeism_rate": 0.02, "training_completed_rate": 0.83},
                "research": {"publications_count": 41, "active_projects": 17, "funding_secured": 350000, "patents_filed": 6},
                "infrastructure": {"classroom_occupancy_rate": 0.92, "it_equipment_ok_rate": 0.97, "ongoing_works": 1},
                "esg": {"energy_consumption_kwh": 170000, "recycling_rate": 0.24, "green_mobility_rate": 0.17},
                "partnerships": {"active_agreements": 24, "outgoing_mobility": 38, "incoming_mobility": 20, "international_projects": 10},
            },
        },
    ],
    "inst-isg-004": [
        {
            "period": "2023-S2",
            "data": {
                "academic": {"success_rate": 0.71, "attendance_rate": 0.78, "dropout_rate": 0.14, "repetition_rate": 0.16, "exam_pass_rate": 0.68},
                "finance": {"budget_allocated": 1800000, "budget_used": 1530000, "budget_execution_rate": 0.85, "cost_per_student": 1500},
                "employment": {"employability_rate": 0.58, "insertion_delay_months": 9, "national_partnership_rate": 0.38},
                "hr": {"teaching_staff_count": 110, "admin_staff_count": 32, "absenteeism_rate": 0.09, "training_completed_rate": 0.42},
                "research": {"publications_count": 12, "active_projects": 5, "funding_secured": 80000, "patents_filed": 0},
                "infrastructure": {"classroom_occupancy_rate": 0.75, "it_equipment_ok_rate": 0.82, "ongoing_works": 1},
                "esg": {"energy_consumption_kwh": 95000, "recycling_rate": 0.08, "green_mobility_rate": 0.05},
                "partnerships": {"active_agreements": 8, "outgoing_mobility": 10, "incoming_mobility": 5, "international_projects": 2},
            },
        },
        {
            "period": "2024-S1",
            "data": {
                "academic": {"success_rate": 0.68, "attendance_rate": 0.74, "dropout_rate": 0.17, "repetition_rate": 0.18, "exam_pass_rate": 0.65},
                "finance": {"budget_allocated": 1800000, "budget_used": 1476000, "budget_execution_rate": 0.82, "cost_per_student": 1520},
                "employment": {"employability_rate": 0.55, "insertion_delay_months": 10, "national_partnership_rate": 0.35},
                "hr": {"teaching_staff_count": 102, "admin_staff_count": 30, "absenteeism_rate": 0.11, "training_completed_rate": 0.35},
                "research": {"publications_count": 10, "active_projects": 4, "funding_secured": 65000, "patents_filed": 0},
                "infrastructure": {"classroom_occupancy_rate": 0.73, "it_equipment_ok_rate": 0.79, "ongoing_works": 1},
                "esg": {"energy_consumption_kwh": 98000, "recycling_rate": 0.07, "green_mobility_rate": 0.04},
                "partnerships": {"active_agreements": 7, "outgoing_mobility": 8, "incoming_mobility": 4, "international_projects": 2},
            },
        },
        {
            "period": "2024-S2",
            "data": {
                "academic": {"success_rate": 0.63, "attendance_rate": 0.70, "dropout_rate": 0.20, "repetition_rate": 0.20, "exam_pass_rate": 0.60},
                "finance": {"budget_allocated": 1800000, "budget_used": 1404000, "budget_execution_rate": 0.78, "cost_per_student": 1550},
                "employment": {"employability_rate": 0.52, "insertion_delay_months": 11, "national_partnership_rate": 0.32},
                "hr": {"teaching_staff_count": 95, "admin_staff_count": 28, "absenteeism_rate": 0.13, "training_completed_rate": 0.29},
                "research": {"publications_count": 8, "active_projects": 3, "funding_secured": 50000, "patents_filed": 0},
                "infrastructure": {"classroom_occupancy_rate": 0.70, "it_equipment_ok_rate": 0.76, "ongoing_works": 0},
                "esg": {"energy_consumption_kwh": 100000, "recycling_rate": 0.06, "green_mobility_rate": 0.04},
                "partnerships": {"active_agreements": 6, "outgoing_mobility": 7, "incoming_mobility": 3, "international_projects": 1},
            },
        },
    ],
}


# ── Alert data ────────────────────────────────────────────

ALERTS = [
    # INSAT — dropout crisis
    {"institution_id": "inst-insat-001", "severity": "CRITICAL", "message": "Dropout rate 28% exceeds safe threshold (20%). Up from 19% in 2023-S2."},
    {"institution_id": "inst-insat-001", "severity": "WARNING", "message": "Attendance rate 71% — critically low. Down from 88% in 2023-S2."},
    # ENIT — budget problem
    {"institution_id": "inst-enit-002", "severity": "WARNING", "message": "Budget execution rate 47% — severely underspent with 2 months left in semester."},
    {"institution_id": "inst-enit-002", "severity": "WARNING", "message": "IT equipment OK rate 61% — deteriorating. Down from 75% in 2023-S2."},
    # ESPRIT — no alerts (the star)
    # ISG — HR crisis
    {"institution_id": "inst-isg-004", "severity": "CRITICAL", "message": "Staff absenteeism rate 13% — extremely elevated. Safe threshold is 5%."},
    {"institution_id": "inst-isg-004", "severity": "WARNING", "message": "Academic success rate declining: 71% → 68% → 63% over 3 semesters."},
    {"institution_id": "inst-isg-004", "severity": "WARNING", "message": "Training completion rate 29% — staff development severely lacking."},
]


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def seed() -> None:
    """Run the full seed — idempotent."""
    conn = get_conn()
    try:
        # ── 1. Seed institutions ──────────────────────────
        logger.info("Seeding %d institutions...", len(INSTITUTIONS))
        for inst in INSTITUTIONS:
            if is_postgres():
                conn.execute(
                    """INSERT INTO institutions (id, name, slug, type, city)
                       VALUES (?, ?, ?, ?, ?)
                       ON CONFLICT (id) DO NOTHING""",
                    (inst["id"], inst["name"], inst["slug"], inst["type"], inst["city"]),
                )
            else:
                conn.execute(
                    """INSERT OR IGNORE INTO institutions (id, name, slug, type, city)
                       VALUES (?, ?, ?, ?, ?)""",
                    (inst["id"], inst["name"], inst["slug"], inst["type"], inst["city"]),
                )
            logger.info("  ✓ %s (%s)", inst["slug"], inst["id"][:16])

        # ── 2. Seed KPI snapshots ─────────────────────────
        total_kpis = 0
        for inst_id, snapshots in KPI_DATA.items():
            for snap in snapshots:
                trace_id = uuid.uuid4().hex
                data_payload = json.dumps(snap["data"])
                conn.execute(
                    """INSERT INTO kpi_snapshots (institution_id, period, trace_id, data)
                       VALUES (?, ?, ?, ?)""",
                    (inst_id, snap["period"], trace_id, data_payload),
                )
                total_kpis += 1
        logger.info("Seeded %d KPI snapshots", total_kpis)

        # ── 3. Seed alerts ────────────────────────────────
        for alert in ALERTS:
            conn.execute(
                """INSERT INTO alerts (institution_id, severity, message)
                   VALUES (?, ?, ?)""",
                (alert["institution_id"], alert["severity"], alert["message"]),
            )
        logger.info("Seeded %d alerts", len(ALERTS))

        conn.commit()
        logger.info("✅ Seed complete!")

    except Exception:
        logger.exception("Seed failed")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    # Run migrations first to ensure tables exist
    from app.db.migrate import run_migration
    run_migration()
    seed()
