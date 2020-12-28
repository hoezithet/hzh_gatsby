import re
from pathlib import Path

lessen_root = Path('src/content/lessen')

class SvgCallback:
    def __init__(self):
        self.ptrn = re.compile(r'{{< ?svg ?"(?P<src>[^"]*)\.(svg|png)" ?"(?P<alt>[^"]*)" ?>}}')

    def __call__(self, line):
        m = self.ptrn.search(line)
        if m is None:
            return line
        original = m.group(0)
        replacement = f'![{m.group("alt")}]({m.group("src")}.png)'
        return line.replace(original, replacement)

class MuteCallback:
    def __init__(self):
        self.ptrn = re.compile(r'{{< ?mute ?"(?P<text>[^"]*)" ?>}}')

    def __call__(self, line):
        m = self.ptrn.search(line)
        if m is None:
            return line
        original = m.group(0)
        replacement = f'<Mute text="{m.group("text")}"/>'
        return line.replace(original, replacement)

class ClassCallback:
    def __init__(self):
        self.ptrn = re.compile(r'{{< ?class ?"(?P<text>[^"]*)" ?"(?P<class>[^"]*)" ?>}}')

    def __call__(self, line):
        m = self.ptrn.search(line)
        if m is None:
            return line
        original = m.group(0)
        replacement = f'<span class="{m.group("class")}">{m.group("text")}</span>'
        return line.replace(original, replacement)

class AttentionCallback:
    def __init__(self):
        self.opening_ptrn = re.compile(r'{{< ?attention ?"(?P<title>[^"]*)" ?>}}')
        self.closing_ptrn = re.compile(r'{{< ?/attention ?>}}')
    
    def __call__(self, line):
        m_open = self.opening_ptrn.search(line)
        m_close = self.closing_ptrn.search(line)

        if m_open:
            replacement = f'<Attention title="{m_open.group("title")}">\n'
            line = line.replace(m_open.group(0), replacement)
        if m_close:
            replacement = f'</Attention>'
            line = line.replace(m_close.group(0), replacement)

        return line

class ExpandCallback:
    def __init__(self):
        self.opening_ptrn = re.compile(r'{{< ?expand ?"(?P<title>[^"]*)" ?>}}')
        self.closing_ptrn = re.compile(r'{{< ?/expand ?>}}')
    
    def __call__(self, line):
        m_open = self.opening_ptrn.search(line)
        m_close = self.closing_ptrn.search(line)

        if m_open:
            replacement = f'<Expand title="{m_open.group("title")}">\n'
            line = line.replace(m_open.group(0), replacement)
        if m_close:
            replacement = f'</Expand>'
            line = line.replace(m_close.group(0), replacement)

        return line

class DisplayMathCallback:
    def __init__(self):
        self.ptrn = re.compile(r'^\$\$?(?P<expr>[^$]+)\$\$?$')

    def __call__(self, line):
        m = self.ptrn.search(line)
        if m is None:
            return line
        original = m.group(0)
        replacement = f'$$\n{m.group("expr")}\n$$'
        return line.replace(original, replacement)

class InlineMathCallback:
    def __init__(self):
        self.ptrn = re.compile(r'^\$\$?(?P<expr>[^$]+)\$\$?$')

    def __call__(self, line):
        m = self.ptrn.search(line)
        if m is None:
            return line
        original = m.group(0)
        replacement = f'$$\n{m.group("expr")}\n$$'
        return line.replace(original, replacement)



lessen_paths = list(lessen_root.rglob('**/index.mdx'))

for mdx_file in lessen_paths:
    callbacks = [
        SvgCallback(),
        AttentionCallback(),
        MuteCallback(),
        DisplayMathCallback(),
        ExpandCallback(),
        ClassCallback(),
    ]
    new_lines = []
    nothing_changed = True
    for line in mdx_file.read_text().split('\n'):
        old_line = line
        for callback in callbacks:
            line = callback(line)
        new_lines.append(line)
        if line != old_line:
            nothing_changed = False

    if nothing_changed:
        continue
    else:
        mdx_file.write_text('\n'.join(new_lines))