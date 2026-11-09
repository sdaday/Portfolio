"""Convert the supplied DOCX to local, file:// compatible document data."""
import argparse
import hashlib
import html
import json
import posixpath
import re
from copy import deepcopy
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'v': 'urn:schemas-microsoft-com:vml',
}


def renumber_figures(value):
    # Only explicit figure labels/references; never chapter or parameter numbers.
    return re.sub(r'图(\s*)([0-9]+)(?![\d.])',
                  lambda match: '图' + match[1] + str(int(match[2]) + 2), value)


def convert(source):
    with ZipFile(source) as archive:
        doc = ET.fromstring(archive.read('word/document.xml'))
        rels = ET.fromstring(archive.read('word/_rels/document.xml.rels'))
        targets = {r.get('Id'): r.get('Target') for r in rels}
        body = doc.find('w:body', NS)
        image_dir = ROOT / 'assets/images/skyfire'
        image_dir.mkdir(parents=True, exist_ok=True)
        headings, blocks, media = [], [], {}
        section = 'overview'

        def text(node):
            return ''.join(node.xpath('.//w:t/text()', namespaces=NS))

        def paragraph(p):
            p = deepcopy(p)
            nodes = p.xpath('.//w:t', namespaces=NS)
            joined = ''.join(n.text or '' for n in nodes)
            offsets, offset = [], 0
            for n in nodes:
                offsets.append((offset, offset + len(n.text or ''), n))
                offset += len(n.text or '')
            # Word can split a figure number across several formatted runs.
            for match in reversed(list(re.finditer(r'图\s*([0-9]+)(?![\d.])', joined))):
                start, end = match.span(1)
                replacement = str(int(match[1]) + 2)
                first = True
                for low, high, n in offsets:
                    if low < end and high > start:
                        left, right = max(start - low, 0), min(end - low, high - low)
                        value = n.text or ''
                        n.text = value[:left] + (replacement if first else '') + value[right:]
                        first = False
            parts = []
            for run in p.xpath('.//w:r', namespaces=NS):
                content = []
                for el in run:
                    if el.tag == '{%s}t' % NS['w']:
                        content.append(html.escape(el.text or ''))
                    elif el.tag == '{%s}tab' % NS['w']:
                        content.append('&#9;')
                    elif el.tag == '{%s}br' % NS['w']:
                        content.append('<br>')
                    elif el.tag.endswith('}drawing') or el.tag.endswith('}pict'):
                        for pic in el.xpath('.//a:blip|.//v:imagedata', namespaces=NS):
                            rid = pic.get('{%s}embed' % NS['r']) or pic.get('{%s}id' % NS['r'])
                            target = targets.get(rid)
                            if not target:
                                raise ValueError('Unresolved image relationship ' + str(rid))
                            entry = posixpath.normpath(posixpath.join('word', target))
                            if entry not in media:
                                name = '%s-%02d%s' % (section, len(media) + 1, Path(entry).suffix)
                                raw = archive.read(entry)
                                (image_dir / name).write_bytes(raw)
                                media[entry] = {'src': 'assets/images/skyfire/' + name,
                                                'sha256': hashlib.sha256(raw).hexdigest()}
                            src = media[entry]['src']
                            alt = el.xpath('.//*[local-name()="docPr"]/@descr')
                            content.append('<button class="plan-image" type="button" data-plan-image="%s" aria-label="放大图片"><img src="%s" alt="%s" loading="lazy" decoding="async"></button>' % (src, src, html.escape(alt[0] if alt else '策划案原始截图', quote=True)))
                            if src.endswith('/overview-01.jpeg') or src.endswith('/overview-02.jpeg'):
                                number = 1 if src.endswith('/overview-01.jpeg') else 2
                                content.append('<div class="plan-caption">图%d 课件中的游戏要求</div>' % number)
                value = ''.join(content)
                # Keep emphasis, but let the website own typography and colours.
                if run.find('w:rPr/w:b', NS) is not None:
                    value = '<strong>' + value + '</strong>'
                if run.find('w:rPr/w:i', NS) is not None:
                    value = '<em>' + value + '</em>'
                parts.append(value)
            return ''.join(parts)

        for node in body:
            if node.tag == '{%s}p' % NS['w']:
                label = text(node)
                style = node.xpath('./w:pPr/w:pStyle/@w:val', namespaces=NS)
                level = {'1': 1, '21': 2, '31': 3}.get(style[0] if style else '')
                if level:
                    number = re.match(r'\d+(?:\.\d+)*', label)
                    slug = number.group().replace('.', '-') if number else str(sum(h['level'] == 1 for h in headings) + 1)
                    ident = 'skyfire-section-' + slug
                    if any(h['id'] == ident for h in headings):
                        raise ValueError('Duplicate heading ' + ident)
                    section = {'1': 'overview', '2': 'technical-art', '3': 'gameplay', '4': 'collaboration', '5': 'evaluation'}.get(slug.split('-')[0], 'document')
                    headings.append({'id': ident, 'level': level, 'title': label})
                    blocks.append({'kind': 'heading', **headings[-1]})
                else:
                    markup = paragraph(node)
                    if markup:
                        caption = bool(re.match(r'^图\s*\d+', label))
                        cls = 'plan-caption' if caption else 'plan-paragraph'
                        blocks.append({'kind': 'html', 'html': '<div class="%s">%s</div>' % (cls, markup)})
            elif node.tag == '{%s}tbl' % NS['w']:
                pictures = bool(node.xpath('.//a:blip|.//v:imagedata', namespaces=NS))
                rows = []
                for row_index, row in enumerate(node.findall('w:tr', NS)):
                    cells = []
                    for cell in row.findall('w:tc', NS):
                        markup = ''.join('<div>%s</div>' % paragraph(p) for p in cell.findall('w:p', NS))
                        span = cell.xpath('./w:tcPr/w:gridSpan/@w:val', namespaces=NS)
                        tag = 'th' if row_index == 0 and not pictures else 'td'
                        attr = ' scope="col"' if tag == 'th' else ''
                        if span:
                            attr += ' colspan="%s"' % int(span[0])
                        cells.append('<%s%s>%s</%s>' % (tag, attr, markup, tag))
                    rows.append('<tr>' + ''.join(cells) + '</tr>')
                if pictures:
                    # These Word tables are paired figures rather than data tables.
                    cells = node.xpath('./w:tr/w:tc', namespaces=NS)
                    markup = '<div class="plan-figure-pair">' + ''.join('<figure>' + ''.join('<div class="plan-caption">%s</div>' % paragraph(p) if re.match(r'^图\s*\d+', text(p)) else '<div>%s</div>' % paragraph(p) for p in c.findall('w:p', NS)) + '</figure>' for c in cells) + '</div>'
                else:
                    markup = '<div class="plan-table-scroll" tabindex="0" role="region" aria-label="%s"><table><thead>%s</thead><tbody>%s</tbody></table></div>' % ('个人职责表' if len(rows) > 5 else '玩家武器对比表', rows[0], ''.join(rows[1:]))
                blocks.append({'kind': 'html', 'html': markup})

        source_paragraphs = [''.join(p.xpath('.//w:t/text()', namespaces=NS)) for p in body.xpath('.//w:p', namespaces=NS)]
        result = {'source': Path(source).name, 'headings': headings, 'blocks': blocks,
                  'media': list(media.values()), 'stats': {'headings': len(headings), 'images': len(media), 'dataTables': 2}}
        output = ROOT / 'assets/data/skyfire-document.js'
        output.write_text('window.SKYFIRE_DOCUMENT = ' + json.dumps(result, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
        # Compare every source paragraph against rendered text (not just counts).
        rendered = ''.join(b.get('html', html.escape(b.get('title', ''))) for b in blocks)
        plain = html.unescape(re.sub('<[^>]+>', '', rendered))
        missing = [p for p in source_paragraphs if p.strip() and renumber_figures(p) not in plain]
        if missing:
            raise ValueError('Text not preserved: ' + repr(missing))
        print(json.dumps({'paragraphsVerified': len(source_paragraphs), **result['stats']}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    convert(parser.parse_args().source)
