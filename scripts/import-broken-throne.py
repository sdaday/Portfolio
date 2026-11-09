"""Import the Broken Throne planning document without rewriting source text."""
import argparse
import hashlib
import html
import json
import posixpath
import re
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as E

ROOT = Path(__file__).resolve().parents[1]
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}


def convert(source):
    blocks, headings, images, tables = [], [], {}, []
    folder = ROOT / 'assets/images/broken-throne'
    folder.mkdir(parents=True, exist_ok=True)
    with ZipFile(source) as z:
        body = E.fromstring(z.read('word/document.xml')).find('w:body', NS)
        rels = {r.get('Id'): r.get('Target') for r in E.fromstring(z.read('word/_rels/document.xml.rels'))}
        section = 'overview'
        text = lambda p: ''.join(p.xpath('.//w:t/text()', namespaces=NS))

        def paragraph(p):
            result = []
            for run in p.xpath('.//w:r', namespaces=NS):
                parts = []
                for child in run:
                    tag = E.QName(child).localname
                    if tag == 't': parts.append(html.escape(child.text or ''))
                    elif tag == 'br': parts.append('<br>')
                    elif tag == 'tab': parts.append('&#9;')
                    elif tag == 'drawing':
                        for pic in child.xpath('.//a:blip', namespaces=NS):
                            target = posixpath.normpath(posixpath.join('word', rels[pic.get('{%s}embed' % NS['r'])]))
                            if target not in images:
                                raw = z.read(target)
                                name = '%s-%02d%s' % (section, len(images) + 1, Path(target).suffix)
                                (folder / name).write_bytes(raw)
                                images[target] = {'src': 'assets/images/broken-throne/' + name, 'sha256': hashlib.sha256(raw).hexdigest()}
                            src = images[target]['src']
                            parts.append('<button class="plan-image" type="button" data-plan-image="%s" aria-label="放大图片"><img src="%s" alt="Broken Throne 策划案截图" loading="lazy" decoding="async"></button>' % (src, src))
                value = ''.join(parts)
                if run.find('w:rPr/w:b', NS) is not None: value = '<strong>' + value + '</strong>'
                if run.find('w:rPr/w:i', NS) is not None: value = '<em>' + value + '</em>'
                result.append(value)
            return ''.join(result)

        def cell_content(cell):
            return ''.join('<div%s>%s</div>' % (' class="plan-caption"' if re.match(r'^图(?:表)?\s*\d+', text(p)) else '', paragraph(p)) for p in cell.findall('w:p', NS))

        for node in body:
            style = node.xpath('./w:pPr/w:pStyle/@w:val', namespaces=NS)
            level = {'1': 1, '21': 2, '31': 3}.get(style[0] if style else '')
            if level:
                label = text(node)
                number = re.match(r'\d+(?:\.\d+)*', label)
                slug = number.group().replace('.', '-') if number else str(sum(h['level'] == 1 for h in headings) + 1)
                ident = 'broken-throne-section-' + slug
                section = {'1': 'overview', '2': 'player-combat', '3': 'enemy-design', '4': 'level-ui', '5': 'blueprints', '6': 'evaluation'}[slug.split('-')[0]]
                heading = {'kind': 'heading', 'level': level, 'title': label, 'id': ident}
                headings.append({k: v for k, v in heading.items() if k != 'kind'})
                blocks.append(heading)
            elif node.tag == '{%s}p' % NS['w']:
                value = paragraph(node)
                if value:
                    cls = 'plan-caption' if re.match(r'^图(?:表)?\s*\d+', text(node)) else 'plan-paragraph'
                    blocks.append({'kind': 'html', 'html': '<div class="%s">%s</div>' % (cls, value)})
            elif node.tag == '{%s}tbl' % NS['w']:
                kind = 'html'
                if node.xpath('.//a:blip', namespaces=NS):
                    markup = '<div class="plan-figure-pair">' + ''.join('<figure>' + cell_content(c) + '</figure>' for c in node.xpath('./w:tr/w:tc', namespaces=NS)) + '</div>'
                else:
                    values = [[text(c) for c in row.findall('w:tc', NS)] for row in node.findall('w:tr', NS)]
                    tables.append(values)
                    if values[0] == ['游戏名称', 'Broken Throne']:
                        kind = 'source-info'
                    # Several source tables have no header row; do not promote data to a header.
                    has_header = values[0][0] in ['动作组合', '攻击组合', '保存内容', '时间']
                    rows = []
                    for i, row in enumerate(node.findall('w:tr', NS)):
                        tag = 'th' if i == 0 and has_header else 'td'
                        rows.append('<tr>' + ''.join('<%s%s>%s</%s>' % (tag, ' scope="col"' if tag == 'th' else '', cell_content(c), tag) for c in row.findall('w:tc', NS)) + '</tr>')
                    markup = '<div class="plan-table-scroll" tabindex="0" role="region" aria-label="策划案数据表"><table>' + ('<thead>' + rows.pop(0) + '</thead>' if has_header else '') + '<tbody>' + ''.join(rows) + '</tbody></table></div>'
                blocks.append({'kind': kind, 'html': markup})

        # Every source paragraph/cell must be preserved, including numbers and formulas.
        rendered = ''.join(b.get('html', html.escape(b.get('title', ''))) for b in blocks)
        plain = html.unescape(re.sub('<[^>]+>', '', rendered))
        paragraphs = [text(p) for p in body.xpath('.//w:p', namespaces=NS)]
        missing = [p for p in paragraphs if p.strip() and p not in plain]
        if missing: raise ValueError('Unpreserved text: ' + repr(missing))
        # The reader already renders this information in the top project table.
        blocks = [block for block in blocks if block['kind'] != 'source-info']
        tables = [table for table in tables if table[0] != ['游戏名称', 'Broken Throne']]
        if len({h['id'] for h in headings}) != len(headings): raise ValueError('Duplicate headings')
        info = {
            'toolbar': '01 / BROKEN THRONE', 'tocId': 'broken-throne-toc', 'bodyLabel': 'Broken Throne 策划案正文',
            'title': 'Broken Throne 个人动作游戏策划案', 'gameName': 'Broken Throne',
            'gameType': '第三人称动作冒险、类魂游戏',
            'summary': '本作作为序章，玩家将扮演一位流亡王子，在地牢中探索、战斗、收集资源，并击败最终 Boss，开启夺回王国的旅程。',
            'cover': 'assets/images/projects/Individual game.png', 'coverLabel': 'Broken Throne 游戏实机画面'
        }
        result = {'source': Path(source).name, 'info': info, 'headings': headings, 'blocks': blocks, 'media': list(images.values()),
                  'tables': tables, 'stats': {'headings': len(headings), 'images': len(images), 'dataTables': len(tables)}}
        (ROOT / 'assets/data/broken-throne-document.js').write_text('window.BROKEN_THRONE_DOCUMENT = ' + json.dumps(result, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
        print(json.dumps({'paragraphsVerified': len(paragraphs), **result['stats']}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    convert(parser.parse_args().source)
