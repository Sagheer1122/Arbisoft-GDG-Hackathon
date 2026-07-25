import os
import shutil

artifacts_dir = r"C:\Users\Tech Planet\.gemini\antigravity-ide\brain\68f05708-b5cd-40fc-99da-b0e5711c4d30"
target_dir = r"c:\Users\Tech Planet\Desktop\New folder (3)\screenshots"

os.makedirs(target_dir, exist_ok=True)

# Key UI captures mapping
images_to_copy = [
    ("media__1784970646315.png", "dashboard_overview.png"),
    ("media__1784967293158.png", "roster_calendar.png"),
    ("media__1784966842623.png", "gemma_communication_simulator.png"),
    ("media__1784966517090.png", "gemma_evaluation_results.png"),
    ("media__1784966081908.png", "gemma_tick_tac_toe_break_game.png"),
    ("media__1784965673956.png", "shift_swap_requests.png"),
    ("hijab_female_nurse_1784965707207.png", "hijab_female_nurse.png"),
    ("male_nurse_1784965728135.png", "male_nurse.png")
]

for src_name, dest_name in images_to_copy:
    src_path = os.path.join(artifacts_dir, src_name)
    dest_path = os.path.join(target_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        print(f"Copied {src_name} -> screenshots/{dest_name}")
    else:
        print(f"File not found: {src_path}")

print("Screenshots directory populated successfully.")
