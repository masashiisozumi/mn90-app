#!/usr/bin/env python3
"""workflow に埋め込んだ python が、構文として通るかを見る。

2026-09-02、YAML は通るのに python のインデントだけ壊れた状態で
push しかけた。**YAMLが通る ≠ 中の python が動く。**
push の前にこれを通すこと。

  python3 tools/check-workflow-python.py
"""
import re, sys, glob, yaml

bad = 0
for path in sorted(glob.glob(".github/workflows/*.yml")):
    doc = yaml.safe_load(open(path, encoding="utf-8"))
    for job in (doc.get("jobs") or {}).values():
        for st in job.get("steps", []):
            run = st.get("run", "") or ""
            for m in re.finditer(r"python3 - <<'PY'.*?\n(.*?)\n\s*PY\b", run, re.S):
                try:
                    compile(m.group(1), f"{path}:{st.get('name','?')}", "exec")
                    print("OK  ", path, "/", st.get("name"))
                except SyntaxError as e:
                    bad += 1
                    print("NG  ", path, "/", st.get("name"), "->", e)
print("問題なし" if not bad else f"**{bad}件、中の python が壊れている**")
sys.exit(1 if bad else 0)
