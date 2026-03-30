import { useState, useRef, useEffect } from "react";

const quizData = [
  {
    q: `Xâu ký tự nào sau đây là hợp lệ trong Python?`,
    opts: [`123 + 456`, `'Xin chào'`, `Xin chào`, `print`],
    ans: 1,
    explain: `Xâu hợp lệ phải nằm trong dấu nháy đơn hoặc nháy kép. 'Xin chào' có dấu nháy đơn bao quanh nên hợp lệ.`
  },
  {
    q: `Cho s = "Python". Giá trị của s[0] là gì?`,
    opts: [`"P"`, `"y"`, `"Python"`, `Lỗi`],
    ans: 0,
    explain: `Chỉ số trong Python đếm từ 0. s[0] là ký tự đầu tiên, tức "P".`
  },
  {
    q: `Cho s = "Hà Nội". Giá trị của len(s) là bao nhiêu?`,
    opts: [`5`, `6`, `7`, `4`],
    ans: 1,
    explain: `"Hà Nội" có 6 ký tự: H, à, (dấu cách), N, ộ, i. Dấu cách cũng được tính.`
  },
  {
    q: `Cho s = "abcdef". Lệnh s[6] sẽ cho kết quả gì?`,
    opts: [`"f"`, `"e"`, `""`, `Lỗi IndexError`],
    ans: 3,
    explain: `Xâu "abcdef" có 6 ký tự, chỉ số chạy từ 0 đến 5. s[6] vượt ngoài phạm vi → lỗi IndexError.`
  },
  {
    q: `Cho s = "Hello". Lệnh s[1] = "a" sẽ cho kết quả gì?`,
    opts: [`s = "Hallo"`, `s = "aello"`, `Lỗi TypeError`, `s = "Hello a"`],
    ans: 2,
    explain: `Xâu là bất biến (immutable), không thể thay đổi từng ký tự. Gán s[1] = "a" báo lỗi TypeError.`
  },
  {
    q: `Cho s = "Tin học". Kết quả của s[3] là gì?`,
    opts: [`"n"`, `" "`, `"h"`, `"T"`],
    ans: 1,
    explain: `T=0, i=1, n=2, (dấu cách)=3. Vậy s[3] là dấu cách " ".`
  },
  {
    q: `Phát biểu nào sau đây ĐÚNG về xâu ký tự?`,
    opts: [
      `Xâu có thể thay đổi từng ký tự`,
      `Chỉ số xâu đếm từ 1`,
      `Xâu là dãy ký tự, truy cập bằng chỉ số từ 0`,
      `len("") trả về 1`
    ],
    ans: 2,
    explain: `Xâu là dãy ký tự, chỉ số đếm từ 0. Xâu bất biến (không sửa được từng ký tự). len("") = 0.`
  },
  {
    q: `Đoạn code sau in ra gì?\nfor ch in "ABC":\n    print(ch, end="-")`,
    opts: [`A-B-C-`, `ABC`, `A B C`, `0-1-2-`],
    ans: 0,
    explain: `for ch in "ABC" gán ch = "A", "B", "C". In mỗi ch rồi nối dấu "-" → A-B-C-`
  },
  {
    q: `Kết quả của "abc" in "xyzabcdef" là gì?`,
    opts: [`True`, `False`, `"abc"`, `Lỗi`],
    ans: 0,
    explain: `Toán tử in kiểm tra xâu con: "abc" có xuất hiện liên tiếp trong "xyzabcdef" → True.`
  },
  {
    q: `Kết quả của "AB" in "aAbBc" là gì?`,
    opts: [`True`, `False`],
    ans: 1,
    explain: `Python phân biệt hoa thường. Trong "aAbBc" có "Ab" chứ không có "AB" liền nhau → False.`
  },
  {
    q: `Kết quả của 1 in ["0", "1", "01", "10"] là gì?`,
    opts: [`True`, `False`],
    ans: 1,
    explain: `Số nguyên 1 (int) khác chuỗi "1" (str). Danh sách chứa toàn chuỗi, không chứa số 1 → False.`
  },
  {
    q: `Đoạn code sau in ra gì?\ns = "81723"\nskq = ""\nfor ch in s:\n    if int(ch) % 2 != 0:\n        skq = skq + ch\nprint(skq)`,
    opts: [`"173"`, `173`, `"827"`, `"81723"`],
    ans: 0,
    explain: `Lọc ký tự có giá trị số lẻ: '1', '7', '3' → nối thành chuỗi "173". Đây là xâu, không phải số.`
  },
  {
    q: `Cho s = "Python". Vòng lặp nào duyệt đúng từng ký tự?`,
    opts: [
      `for i in s: print(s[i])`,
      `for i in range(len(s)): print(s[i])`,
      `for i in len(s): print(s[i])`,
      `for i in range(s): print(i)`
    ],
    ans: 1,
    explain: `range(len(s)) tạo dãy 0→5. Dùng s[i] truy cập từng ký tự. Các cách khác đều bị lỗi.`
  },
  {
    q: `Sự khác biệt chính giữa\nfor i in range(len(s))  và  for ch in s  là gì?`,
    opts: [
      `Không có khác biệt`,
      `Cách 1: i là chỉ số. Cách 2: ch là ký tự`,
      `Cách 1 nhanh hơn cách 2`,
      `Cách 2 chỉ dùng được với danh sách`
    ],
    ans: 1,
    explain: `Cách 1: i chạy qua chỉ số (0,1,2,...), cần s[i] để lấy ký tự. Cách 2: ch nhận trực tiếp từng ký tự.`
  },
  {
    q: `Cho s = "abcdef". Đoạn code sau in ra gì?\nkq = ""\nfor i in range(3):\n    kq = kq + s[i]\nprint(kq)`,
    opts: [`"abc"`, `"def"`, `"abcdef"`, `Lỗi`],
    ans: 0,
    explain: `range(3) → i = 0, 1, 2. Nối s[0]='a', s[1]='b', s[2]='c' → kq = "abc".`
  },
  {
    q: `Muốn kiểm tra xâu S có chứa chữ số không, cách nào đúng?`,
    opts: [
      `if S == "0123456789":`,
      `if "0123456789" in S:`,
      `Duyệt từng ch, kiểm tra ch in "0123456789"`,
      `if int(S) > 0:`
    ],
    ans: 2,
    explain: `Duyệt từng ký tự ch, kiểm tra ch in "0123456789". Nếu True → S có chứa chữ số. Các cách khác sai logic.`
  },
  {
    q: `Cho s1 = "abc", s2 = "ababcabca".\nGiá trị của s1 + s1 in s2 là gì?`,
    opts: [`True`, `False`, `"abcabc"`, `Lỗi`],
    ans: 0,
    explain: `s1 + s1 = "abcabc". Kiểm tra "abcabc" in "ababcabca" → tìm thấy ở vị trí 2-7 → True.`
  },
  {
    q: `Xâu rỗng "" có độ dài bao nhiêu?`,
    opts: [`0`, `1`, `None`, `Lỗi`],
    ans: 0,
    explain: `Xâu rỗng "" không chứa ký tự nào → len("") = 0.`
  },
  {
    q: `Đoạn code sau kiểm tra điều gì?\nfor i in range(len(S)-1):\n    if S[i]=="1" and S[i+1]=="0":\n        kq = True; break`,
    opts: [
      `S có chứa số 10 (kiểu int) không`,
      `S có chứa xâu con "10" không`,
      `S có bắt đầu bằng "10" không`,
      `S có đúng 10 ký tự không`
    ],
    ans: 1,
    explain: `Code tìm hai ký tự liên tiếp "1" và "0", tức là xâu con "10". Tương đương với "10" in S.`
  },
  {
    q: `Để chèn xâu s1 vào giữa xâu s2 tại vị trí len(s2)//2, ta cần làm gì?`,
    opts: [
      `s2[len(s2)//2] = s1`,
      `s2.insert(len(s2)//2, s1)`,
      `Tách nửa đầu + nửa sau, ghép: nửa đầu + s1 + nửa sau`,
      `s2 = s1 + s2`
    ],
    ans: 2,
    explain: `Xâu bất biến → không gán hay insert được. Phải tạo xâu mới: nửa đầu s2 + s1 + nửa sau s2.`
  }
];

const sections = [
  {
    id: "1", tab: "Xâu ký tự", title: "1. Xâu là một dãy các ký tự",
    blocks: [
      { type: "text", content: `Xâu ký tự (string) là một dãy các ký tự, đặt trong dấu nháy đơn ' ' hoặc nháy kép " ". Xâu có thể truy cập từng ký tự bằng chỉ số, đếm từ 0 — giống hệt danh sách.` },
      { type: "code", title: "Tạo xâu và truy cập ký tự",
        code: `s = "Thời khoá biểu"\n\n# Ký tự:  T  h  ờ  i     k  h  o  á     b  i  ể  u\n# Chỉ số: 0  1  2  3  4  5  6  7  8  9 10 11 12 13\n\nprint(len(s))     # 14 — đếm cả dấu cách\nprint(s[0])       # 'T' — ký tự đầu tiên\nprint(s[10])      # 'b' — ký tự ở chỉ số 10`,
        output: `14\nT\nb` },
      { type: "note", content: `Dấu cách cũng là một ký tự và cũng có chỉ số riêng. Khi đếm len(), nhớ đếm cả dấu cách.` },
      { type: "text", content: `Điểm khác biệt lớn nhất giữa xâu và danh sách: xâu KHÔNG THỂ thay đổi từng ký tự (bất biến). Danh sách thì có thể.` },
      { type: "code", title: "Xâu bất biến — không sửa được từng ký tự",
        code: `# Danh sách — sửa được\nd = ["a", "b", "c"]\nd[0] = "A"              # OK\nprint(d)                 # ["A", "b", "c"]\n\n# Xâu — KHÔNG sửa được\ns = "abc"\n# s[0] = "A"            # Lỗi TypeError!\n# Muốn "sửa" xâu → phải tạo xâu mới`,
        output: `['A', 'b', 'c']` },
      { type: "note", content: `Xâu = chữ khắc trên đá (chỉ đọc). Danh sách = bảng viết phấn (đọc và sửa thoải mái).` }
    ],
    questions: [
      { q: `Các xâu sau có hợp lệ không?\na) "123&*()+-ABC"\nb) "1010110&0101001"\nc) "Tây Nguyên"\nd) 11111111 = 256`,
        a: `a) Hợp lệ — chứa số, ký tự đặc biệt, dấu cách, chữ cái đều OK.\nb) Hợp lệ — chữ số và ký tự & nằm trong dấu nháy.\nc) Hợp lệ — tiếng Việt có dấu, Python hỗ trợ Unicode.\nd) KHÔNG hợp lệ — không có dấu nháy bao quanh.` },
      { q: `Mỗi xâu hợp lệ ở trên có độ dài bao nhiêu?`,
        a: `a) "123&*()+-ABC" → 13 ký tự (đếm cả dấu cách)\nb) "1010110&0101001" → 15 ký tự\nc) "Tây Nguyên" → 10 ký tự (chữ Việt có dấu = 1 ký tự)` }
    ]
  },
  {
    id: "2", tab: "Duyệt xâu", title: "2. Lệnh duyệt ký tự của xâu",
    blocks: [
      { type: "text", content: `Có hai cách duyệt xâu, giống hệt danh sách. Cách 1 dùng chỉ số (khi cần biết vị trí), cách 2 duyệt trực tiếp ký tự (khi chỉ cần giá trị).` },
      { type: "code", title: "Cách 1: Duyệt theo chỉ số",
        code: `s = "Thời khoá biểu"\n\nfor i in range(len(s)):      # i = 0, 1, 2, ..., 13\n    print(s[i], end=" ")     # Phải viết s[i] để lấy ký tự`,
        output: `T h ờ i   k h o á   b i ể u` },
      { type: "code", title: "Cách 2: Duyệt trực tiếp ký tự",
        code: `s = "Thời khoá biểu"\n\nfor ch in s:                 # ch lần lượt = 'T', 'h', 'ờ', ...\n    print(ch, end=" ")       # In thẳng ch, KHÔNG viết s[ch]`,
        output: `T h ờ i   k h o á   b i ể u` },
      { type: "note", content: `Cách 1: i là số nhà → gõ cửa s[i] mới gặp người.\nCách 2: ch là người đã bước ra → nói chuyện thẳng, không gõ cửa.` },
      { type: "text", content: `Toán tử in với xâu có thể kiểm tra cả ký tự đơn lẻ lẫn xâu con (nhiều ký tự liên tiếp).` },
      { type: "code", title: "Toán tử in — kiểm tra xâu con",
        code: `print("a" in "abcd")        # True — ký tự 'a' có trong xâu\nprint("abc" in "abcd")      # True — xâu con "abc" có trong xâu\nprint("xyz" in "abcd")      # False\n\n# Chú ý: khác kiểu = khác nhau\nA = ["0", "1", "01", "10"]\nprint(1 in A)                # False — số 1 khác chuỗi "1"\nprint("01" in A)             # True  — chuỗi so chuỗi`,
        output: `True\nTrue\nFalse\nFalse\nTrue` }
    ],
    questions: [
      { q: `Sau khi thực hiện, biến skq có giá trị gì?\n\ns = "81723"\nskq = ""\nfor ch in s:\n    if int(ch) % 2 != 0:\n        skq = skq + ch`,
        a: `ch='8': 8%2=0 (chẵn) → bỏ qua   → skq = ""\nch='1': 1%2=1 (lẻ)  → nối vào  → skq = "1"\nch='7': 7%2=1 (lẻ)  → nối vào  → skq = "17"\nch='2': 2%2=0 (chẵn) → bỏ qua  → skq = "17"\nch='3': 3%2=1 (lẻ)  → nối vào  → skq = "173"\n\nKết quả: skq = "173" (CHUỖI, không phải số)` },
      { q: `Cho s1 = "abc", s2 = "ababcabca". Đúng hay sai?\na) s1 in s2\nb) s1 + s1 in s2\nc) "abcabca" in s2\nd) "abc123" in s2`,
        a: `a) True — tìm thấy "abc" ở vị trí 2.\nb) "abcabc" in s2 → True — vị trí 2-7.\nc) True — vị trí 2-8.\nd) False — s2 không có chữ số 1,2,3.` }
    ]
  },
  {
    id: "3", tab: "Thực hành", title: "Thực hành: Các lệnh cơ bản với xâu",
    blocks: [
      { type: "text", content: `Nhiệm vụ 1: Nhập n tên học sinh, lưu vào danh sách, in ra mỗi tên trên một dòng.` },
      { type: "code", title: "Nhiệm vụ 1 — Nhập và in danh sách tên",
        code: `n = int(input("Nhập số học sinh trong lớp: "))\nds_lop = []\n\nfor i in range(n):\n    hoten = input("Nhập họ tên học sinh thứ " + str(i+1) + ": ")\n    ds_lop.append(hoten)\n\nprint("Danh sách lớp học:")\nfor i in range(n):\n    print(ds_lop[i])`,
        output: `Nhập số học sinh trong lớp: 3\nNhập họ tên học sinh thứ 1: Nguyễn Văn An\nNhập họ tên học sinh thứ 2: Trần Thị Bình\nNhập họ tên học sinh thứ 3: Lê Văn Cường\nDanh sách lớp học:\nNguyễn Văn An\nTrần Thị Bình\nLê Văn Cường` },
      { type: "text", content: `Nhiệm vụ 2: Kiểm tra xâu S có chứa xâu con "10" không. Sách dạy 2 cách.` },
      { type: "code", title: "Cách 1 — Duyệt theo chỉ số",
        code: `S = input("Nhập xâu ký tự bất kì: ")\nkq = False\n\nfor i in range(len(S) - 1):\n    if S[i] == "1" and S[i+1] == "0":\n        kq = True\n        break\n\nif kq:\n    print("Xâu gốc có chứa xâu '10'")\nelse:\n    print("Xâu gốc không chứa xâu '10'")`,
        output: `Nhập xâu ký tự bất kì: ab10c\nXâu gốc có chứa xâu '10'` },
      { type: "code", title: "Cách 2 — Dùng toán tử in",
        code: `S = input("Nhập xâu ký tự bất kì: ")\ns10 = "10"\n\nif s10 in S:\n    print("Xâu gốc có chứa xâu '10'")\nelse:\n    print("Xâu gốc không chứa xâu '10'")`,
        output: `Nhập xâu ký tự bất kì: ab10c\nXâu gốc có chứa xâu '10'` },
      { type: "note", content: `Trong bài thi, ưu tiên cách 2 vì ngắn và ít lỗi. Nhưng cần hiểu cách 1 để truy vết khi đề cho code.` }
    ],
    questions: []
  },
  {
    id: "4", tab: "Luyện tập", title: "Luyện tập",
    blocks: [
      { type: "text", content: `Hai bài luyện tập áp dụng kiến thức duyệt xâu và toán tử in.` }
    ],
    questions: [
      { q: `Bài 1: Cho xâu S, viết đoạn lệnh trích ra xâu con gồm 3 ký tự đầu tiên của S.`,
        a: `S = input("Nhập xâu: ")\nxau_con = ""\n\nso_ky_tu = 3\nif len(S) < 3:\n    so_ky_tu = len(S)\n\nfor i in range(so_ky_tu):\n    xau_con = xau_con + S[i]\n\nprint("3 ký tự đầu:", xau_con)\n\n# VD: "Python" → "Pyt"  |  "Hi" → "Hi"` },
      { q: `Bài 2: Viết chương trình kiểm tra xâu S có chứa chữ số không.\nThông báo "S có chứa chữ số" hoặc "S không chứa chữ số nào".`,
        a: `S = input("Nhập xâu: ")\nco_chu_so = False\n\nfor ch in S:\n    if ch in "0123456789":\n        co_chu_so = True\n        break\n\nif co_chu_so:\n    print("S có chứa chữ số")\nelse:\n    print("S không chứa chữ số nào")` }
    ]
  },
  {
    id: "5", tab: "Vận dụng", title: "Vận dụng",
    blocks: [
      { type: "text", content: `Hai bài vận dụng nâng cao: chèn xâu vào giữa, và đếm tên trong danh sách.` }
    ],
    questions: [
      { q: `Bài 1: Cho hai xâu s1, s2. Chèn s1 vào giữa s2 tại vị trí len(s2)//2.\nIn kết quả ra màn hình.`,
        a: `s1 = input("Nhập s1: ")\ns2 = input("Nhập s2: ")\ngiua = len(s2) // 2\n\nnua_dau = ""\nfor i in range(giua):\n    nua_dau = nua_dau + s2[i]\n\nnua_sau = ""\nfor i in range(giua, len(s2)):\n    nua_sau = nua_sau + s2[i]\n\nket_qua = nua_dau + s1 + nua_sau\nprint("Kết quả:", ket_qua)\n\n# VD: s1="XX", s2="abcdef" → "abcXXdef"` },
      { q: `Bài 2: Nhập số học sinh và họ tên. Đếm bao nhiêu bạn tên "Hương".\nGợi ý: dùng toán tử in.`,
        a: `n = int(input("Nhập số học sinh: "))\nds = []\n\nfor i in range(n):\n    hoten = input("Nhập họ tên thứ " + str(i+1) + ": ")\n    ds.append(hoten)\n\ndem = 0\nfor ten in ds:\n    if "Hương" in ten:\n        dem = dem + 1\n\nprint("Số bạn tên Hương:", dem)` }
    ]
  }
];

function CodeBox({ title, code, output }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: 8, marginBottom: 14, overflow: 'hidden', background: '#fff' }}>
      {title && <div style={{ padding: '8px 14px', background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', fontSize: 13, fontWeight: 600, color: '#374151' }}>{title}</div>}
      <pre style={{ margin: 0, padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.65, overflowX: 'auto', background: '#fafafa', color: '#1f2937', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{code}</pre>
      {output && (
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '8px 14px', background: '#fff' }}>
          <button onClick={() => setShow(!show)} style={{ background: show ? '#059669' : '#2563eb', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            {show ? '✓ Ẩn kết quả' : '▶ Chạy thử'}
          </button>
          {show && <pre style={{ marginTop: 10, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.6, color: '#166534', whiteSpace: 'pre-wrap' }}>{output}</pre>}
        </div>
      )}
    </div>
  );
}

function NoteBox({ content }) {
  return (
    <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, marginBottom: 14, fontSize: 14, lineHeight: 1.65, color: '#92400e', whiteSpace: 'pre-wrap' }}>
      <span style={{ marginRight: 8 }}>💡</span>{content}
    </div>
  );
}

function Question({ q, a, idx }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: 8, marginBottom: 12, overflow: 'hidden', background: '#fff' }}>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '2px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Câu {idx + 1}</div>
        <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.65, color: '#1f2937', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, background: '#f9fafb', padding: '10px 14px', borderRadius: 6 }}>{q}</pre>
      </div>
      <div style={{ padding: '0 16px 14px' }}>
        <button onClick={() => setShow(!show)} style={{ background: show ? '#f3f4f6' : '#fff', color: show ? '#059669' : '#2563eb', border: `1px solid ${show ? '#d1d5db' : '#bfdbfe'}`, padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {show ? '🔒 Ẩn lời giải' : '🔓 Xem lời giải'}
        </button>
        {show && <pre style={{ marginTop: 10, padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7, color: '#166534', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{a}</pre>}
      </div>
    </div>
  );
}

function QuizTab() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplain, setShowExplain] = useState({});

  const pick = (qi, oi) => { if (!submitted) setAnswers(prev => ({ ...prev, [qi]: oi })); };
  const score = Object.keys(answers).reduce((s, k) => s + (answers[k] === quizData[parseInt(k)].ans ? 1 : 0), 0);
  const answered = Object.keys(answers).length;
  const total = quizData.length;
  const reset = () => { setAnswers({}); setSubmitted(false); setShowExplain({}); };

  return (
    <div>
      {submitted && (
        <div style={{ padding: '16px 20px', background: score >= 16 ? '#f0fdf4' : score >= 10 ? '#fffbeb' : '#fef2f2', border: `1px solid ${score >= 16 ? '#bbf7d0' : score >= 10 ? '#fde68a' : '#fecaca'}`, borderRadius: 8, marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: score >= 16 ? '#166534' : score >= 10 ? '#92400e' : '#991b1b' }}>{score} / {total}</div>
          <div style={{ fontSize: 14, color: score >= 16 ? '#166534' : score >= 10 ? '#92400e' : '#991b1b', marginTop: 4 }}>
            {score >= 18 ? 'Xuất sắc! 🎉' : score >= 16 ? 'Giỏi lắm! 👏' : score >= 12 ? 'Khá tốt, cần ôn thêm.' : score >= 8 ? 'Trung bình, xem lại lý thuyết.' : 'Cần ôn lại kỹ hơn nhé!'}
          </div>
          <button onClick={reset} style={{ marginTop: 12, background: '#2563eb', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🔄 Làm lại</button>
        </div>
      )}

      {quizData.map((item, qi) => {
        const picked = answers[qi];
        const isCorrect = picked === item.ans;
        const sr = submitted;

        return (
          <div key={qi} style={{ border: `1px solid ${sr ? (isCorrect ? '#bbf7d0' : '#fecaca') : '#d1d5db'}`, borderRadius: 8, marginBottom: 12, background: '#fff', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ background: sr ? (isCorrect ? '#dcfce7' : '#fee2e2') : '#f3f4f6', color: sr ? (isCorrect ? '#166534' : '#991b1b') : '#6b7280', padding: '2px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>Câu {qi + 1}</span>
                {sr && <span style={{ fontSize: 14 }}>{isCorrect ? '✅' : '❌'}</span>}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.65, color: '#1f2937', whiteSpace: 'pre-wrap', ...(item.q.includes('\n') ? { fontFamily: "'JetBrains Mono', monospace", background: '#f9fafb', padding: '10px 14px', borderRadius: 6, fontSize: 13 } : {}) }}>{item.q}</div>
            </div>
            <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {item.opts.map((opt, oi) => {
                const isThis = picked === oi;
                const isAns = item.ans === oi;
                let bg = '#f9fafb', border = '1px solid #e5e7eb', color = '#374151';
                if (sr) {
                  if (isAns) { bg = '#dcfce7'; border = '1px solid #86efac'; color = '#166534'; }
                  else if (isThis && !isCorrect) { bg = '#fee2e2'; border = '1px solid #fca5a5'; color = '#991b1b'; }
                } else if (isThis) { bg = '#dbeafe'; border = '1px solid #93c5fd'; color = '#1e40af'; }

                return (
                  <button key={oi} onClick={() => pick(qi, oi)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: bg, border, borderRadius: 6, cursor: sr ? 'default' : 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.5, color, width: '100%' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${isThis ? (sr ? (isAns ? '#22c55e' : '#ef4444') : '#3b82f6') : '#d1d5db'}`, background: isThis ? (sr ? (isAns ? '#22c55e' : '#ef4444') : '#3b82f6') : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, color: isThis ? '#fff' : '#9ca3af', fontWeight: 700, marginTop: 1 }}>
                      {isThis ? '✓' : String.fromCharCode(65 + oi)}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
            {sr && (
              <div style={{ padding: '0 16px 14px' }}>
                <button onClick={() => setShowExplain(p => ({ ...p, [qi]: !p[qi] }))} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                  {showExplain[qi] ? '▾ Ẩn giải thích' : '▸ Xem giải thích'}
                </button>
                {showExplain[qi] && <div style={{ marginTop: 8, padding: '10px 14px', background: '#f9fafb', borderRadius: 6, fontSize: 13, lineHeight: 1.65, color: '#374151' }}>{item.explain}</div>}
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>Đã chọn {answered} / {total} câu</div>
          <button onClick={() => answered > 0 && setSubmitted(true)} disabled={answered === 0} style={{ background: answered === 0 ? '#e5e7eb' : '#2563eb', color: answered === 0 ? '#9ca3af' : '#fff', border: 'none', padding: '10px 32px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: answered === 0 ? 'default' : 'pointer', fontFamily: 'inherit' }}>
            📝 Nộp bài
          </button>
          {answered > 0 && answered < total && <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 8 }}>Còn {total - answered} câu chưa trả lời</div>}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const mainRef = useRef(null);
  const allTabs = [...sections.map(s => s.tab), "Trắc nghiệm"];

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  const isQuiz = tab === allTabs.length - 1;
  const sec = !isQuiz ? sections[tab] : null;

  return (
    <div style={{ fontFamily: "'Noto Sans', 'Segoe UI', sans-serif", background: '#f5f5f5', height: '100vh', display: 'flex', flexDirection: 'column', color: '#1f2937' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        button { transition: opacity 0.15s; }
        button:hover { opacity: 0.85; }
        pre { tab-size: 4; }
      `}</style>

      <div style={{ background: '#fff', borderBottom: '2px solid #2563eb', padding: '14px 20px', flexShrink: 0 }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1e3a5f' }}>🐍 Bài 24: Xâu ký tự</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>Tin học 11 — Chương trình GDPT 2018</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', overflowX: 'auto', flexShrink: 0 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', padding: '0 12px' }}>
          {allTabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ background: 'none', border: 'none', borderBottom: i === tab ? '3px solid #2563eb' : '3px solid transparent', padding: '12px 14px', fontSize: 13, fontWeight: i === tab ? 700 : 500, color: i === tab ? '#2563eb' : '#6b7280', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 60px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {isQuiz ? (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e3a5f', marginBottom: 6, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>📝 Trắc nghiệm ôn tập — Bài 24</h2>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>20 câu bao quát toàn bộ kiến thức. Chọn đáp án rồi bấm "Nộp bài".</p>
              <QuizTab />
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e3a5f', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>{sec.title}</h2>
              {sec.blocks.map((b, i) => {
                if (b.type === 'text') return <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: '#374151', marginBottom: 14 }}>{b.content}</p>;
                if (b.type === 'code') return <CodeBox key={i} title={b.title} code={b.code} output={b.output} />;
                if (b.type === 'note') return <NoteBox key={i} content={b.content} />;
                return null;
              })}
              {sec.questions.length > 0 && (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e40af', marginTop: 28, marginBottom: 14, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                    {tab <= 2 ? '📝 Câu hỏi kiểm tra' : (tab === 3 ? '🏋️ Bài luyện tập' : '🚀 Bài vận dụng')}
                  </h3>
                  {sec.questions.map((question, i) => <Question key={i} q={question.q} a={question.a} idx={i} />)}
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                <button onClick={() => tab > 0 && setTab(tab - 1)} disabled={tab === 0} style={{ background: tab === 0 ? '#f3f4f6' : '#fff', border: '1px solid #d1d5db', color: tab === 0 ? '#9ca3af' : '#374151', padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: tab === 0 ? 'default' : 'pointer', fontFamily: 'inherit' }}>← Phần trước</button>
                <span style={{ fontSize: 13, color: '#9ca3af', alignSelf: 'center' }}>{tab + 1} / {allTabs.length}</span>
                <button onClick={() => tab < allTabs.length - 1 && setTab(tab + 1)} style={{ background: '#2563eb', border: '1px solid #2563eb', color: '#fff', padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Phần sau →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}