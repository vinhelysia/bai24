import { useState, useRef, useEffect } from "react";

const makeExplain = (summary, visual = "", steps = [], wrongs = [], takeaway = "") => ({
  summary,
  visual,
  steps,
  wrongs,
  takeaway,
});

const normalizeExplain = (data) => {
  if (!data) {
    return makeExplain("");
  }
  if (typeof data === "string") {
    return makeExplain(data);
  }
  return {
    summary: data.summary || "",
    visual: data.visual || "",
    steps: data.steps || [],
    wrongs: data.wrongs || [],
    takeaway: data.takeaway || "",
  };
};

const quizData = [
  {
    q: `Xâu ký tự nào sau đây là hợp lệ trong Python?`,
    opts: [`123 + 456`, `'Xin chào'`, `Xin chào`, `print`],
    ans: 1,
    explain: makeExplain(
      `Đáp án đúng là 'Xin chào'. Trong Python, string literal phải được đặt trong dấu nháy đơn hoặc dấu nháy kép.`,
      `Hợp lệ:
'Xin chào'
"Xin chào"

Không phải string:
123 + 456   -> biểu thức số học
Xin chào    -> Python không hiểu là string
print       -> tên hàm built-in`,
      [
        `Quan sát từng đáp án xem có được bao quanh bởi dấu nháy hay không.`,
        `Một string literal là dữ liệu kiểu str, không phải expression hay identifier.`,
        `Chỉ đáp án 'Xin chào' vừa có dấu nháy vừa biểu diễn đúng một xâu ký tự.`,
      ],
      [
        `123 + 456 sai vì đó là phép cộng số, kết quả là số nguyên chứ không phải string.`,
        `Xin chào sai vì không có dấu nháy bao quanh.`,
        `print sai vì đó là tên hàm, không phải một xâu.`,
      ],
      `Muốn nhận ra string nhanh, hãy kiểm tra dấu nháy trước tiên.`
    ),
  },
  {
    q: `Cho s = "Python". Giá trị của s[0] là gì?`,
    opts: [`"P"`, `"y"`, `"Python"`, `Lỗi`],
    ans: 0,
    explain: makeExplain(
      `Đáp án đúng là "P" vì string trong Python dùng zero-based indexing, tức chỉ số bắt đầu từ 0.`,
      `s = "Python"
    0 1 2 3 4 5
    P y t h o n

s[0] -> "P"`,
      [
        `Xâu "Python" có 6 ký tự.`,
        `Ký tự đầu tiên luôn mang chỉ số 0.`,
        `Vì vậy s[0] trả về ký tự đầu tiên là "P".`,
      ],
      [
        `"y" sai vì đó là s[1].`,
        `"Python" sai vì s[0] chỉ lấy 1 ký tự, không lấy cả xâu.`,
        `Lỗi sai vì chỉ số 0 hoàn toàn hợp lệ.`,
      ],
      `Khi làm bài indexing, hãy vẽ hàng chỉ số 0,1,2,... lên trên xâu.`
    ),
  },
  {
    q: `Cho s = "Hà Nội". Giá trị của len(s) là bao nhiêu?`,
    opts: [`5`, `6`, `7`, `4`],
    ans: 1,
    explain: makeExplain(
      `Đáp án đúng là 6 vì hàm len() đếm tất cả ký tự, kể cả dấu cách.`,
      `"Hà Nội"
 1 2 3 4 5 6
 H à _ N ộ i

Dấu cách "_" cũng được tính là 1 ký tự.`,
      [
        `Tách xâu thành từng ký tự: H, à, dấu cách, N, ộ, i.`,
        `Tổng cộng có 6 ký tự.`,
        `Do đó len("Hà Nội") = 6.`,
      ],
      [
        `5 sai vì quên đếm dấu cách.`,
        `7 sai vì đếm thừa.`,
        `4 sai vì bỏ qua cả dấu cách lẫn một số ký tự có dấu.`,
      ],
      `len() đếm ký tự thực tế, không quan tâm đó là chữ, số hay dấu cách.`
    ),
  },
  {
    q: `Cho s = "abcdef". Lệnh s[6] sẽ cho kết quả gì?`,
    opts: [`"f"`, `"e"`, `""`, `Lỗi IndexError`],
    ans: 3,
    explain: makeExplain(
      `Đáp án đúng là lỗi IndexError vì chỉ số 6 vượt quá phạm vi của xâu.`,
      `s = "abcdef"
    0 1 2 3 4 5
    a b c d e f

Chỉ số lớn nhất hợp lệ là 5.
s[6] -> vượt biên -> IndexError`,
      [
        `Xâu "abcdef" có 6 ký tự nên chỉ số chạy từ 0 đến 5.`,
        `s[5] mới là ký tự cuối cùng, tức "f".`,
        `s[6] đi ra ngoài phạm vi cho phép nên Python báo IndexError.`,
      ],
      [
        `"f" sai vì "f" nằm ở s[5], không phải s[6].`,
        `"e" sai vì "e" nằm ở s[4].`,
        `"" sai vì Python không tự trả về xâu rỗng khi truy cập sai chỉ số.`,
      ],
      `Nhớ quy tắc: phần tử cuối cùng có chỉ số len(s) - 1.`
    ),
  },
  {
    q: `Cho s = "Hello". Lệnh s[1] = "a" sẽ cho kết quả gì?`,
    opts: [`s = "Hallo"`, `s = "aello"`, `Lỗi TypeError`, `s = "Hello a"`],
    ans: 2,
    explain: makeExplain(
      `Đáp án đúng là lỗi TypeError vì string là immutable, không thể sửa từng ký tự trực tiếp.`,
      `Danh sách:
d = ["H", "e", "l", "l", "o"]
d[1] = "a"   -> OK

Xâu:
s = "Hello"
s[1] = "a"   -> TypeError`,
      [
        `Trong Python, list là mutable nên có thể gán lại từng phần tử.`,
        `String là immutable nên chỉ đọc theo từng ký tự, không ghi đè từng vị trí được.`,
        `Muốn có "Hallo", phải tạo xâu mới bằng cách ghép các phần lại.`,
      ],
      [
        `s = "Hallo" là kết quả mong muốn, nhưng không thể đạt được bằng lệnh s[1] = "a".`,
        `s = "aello" sai cả về vị trí lẫn cách gán.`,
      ],
      `String giống như “khắc trên đá”: đọc được, nhưng muốn sửa phải tạo bản mới.`
    ),
  },
  {
    q: `Cho s = "Tin học". Kết quả của s[3] là gì?`,
    opts: [`"n"`, `" "`, `"h"`, `"T"`],
    ans: 1,
    explain: makeExplain(
      `Đáp án đúng là dấu cách " " vì chỉ số 3 rơi đúng vào khoảng trắng giữa hai tiếng.`,
      `s = "Tin học"
    0 1 2 3 4 5 6
    T i n _ h ọ c

s[3] -> " "`,
      [
        `Đếm chỉ số từ 0: T=0, i=1, n=2.`,
        `Ký tự tiếp theo là dấu cách nên mang chỉ số 3.`,
        `Vì vậy s[3] trả về " ".`,
      ],
      [
        `"n" sai vì đó là s[2].`,
        `"h" sai vì đó là s[4].`,
        `"T" sai vì đó là s[0].`,
      ],
      `Dấu cách cũng là ký tự thật, có vị trí như mọi ký tự khác.`
    ),
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
    explain: makeExplain(
      `Phát biểu đúng là: xâu là dãy ký tự, truy cập bằng chỉ số từ 0.`,
      `Kiến thức nền:
- String = dãy ký tự
- Index bắt đầu từ 0
- String là immutable
- len("") = 0`,
      [
        `String trong Python là một sequence of characters.`,
        `Các sequence như string, list đều truy cập bằng chỉ số bắt đầu từ 0.`,
        `Xâu không sửa được từng ký tự và xâu rỗng có độ dài bằng 0.`,
      ],
      [
        `“Xâu có thể thay đổi từng ký tự” sai vì string immutable.`,
        `“Chỉ số đếm từ 1” sai vì Python bắt đầu từ 0.`,
        `“len(\"\") trả về 1” sai vì xâu rỗng không có ký tự nào.`,
      ],
      `Bộ ba phải nhớ: string = sequence, index từ 0, immutable.`
    ),
  },
  {
    q: `Đoạn code sau in ra gì?\nfor ch in "ABC":\n    print(ch, end="-")`,
    opts: [`A-B-C-`, `ABC`, `A B C`, `0-1-2-`],
    ans: 0,
    explain: makeExplain(
      `Đáp án đúng là A-B-C- vì vòng lặp duyệt từng ký tự và print dùng end="-" để nối thêm dấu gạch ngang sau mỗi lần in.`,
      `Lần lặp 1: ch = "A" -> in "A-"
Lần lặp 2: ch = "B" -> in "B-"
Lần lặp 3: ch = "C" -> in "C-"

Kết quả cuối: A-B-C-`,
      [
        `for ch in "ABC" sẽ cho ch nhận lần lượt "A", "B", "C".`,
        `print(ch, end="-") không xuống dòng ngay, mà thêm dấu "-" sau ký tự.`,
        `Ba lần in nối liên tiếp tạo thành A-B-C-.`,
      ],
      [
        `ABC sai vì thiếu dấu "-".`,
        `A B C sai vì end không phải dấu cách.`,
        `0-1-2- sai vì vòng lặp đang duyệt ký tự, không duyệt chỉ số.`,
      ],
      `Muốn đoán output của vòng lặp, hãy trace từng vòng một.`
    ),
  },
  {
    q: `Kết quả của "abc" in "xyzabcdef" là gì?`,
    opts: [`True`, `False`, `"abc"`, `Lỗi`],
    ans: 0,
    explain: makeExplain(
      `Đáp án đúng là True vì toán tử in đang kiểm tra xem xâu con "abc" có xuất hiện liên tiếp trong xâu lớn hơn hay không.`,
      `"xyzabcdef"
   abc
=> có xuất hiện liên tiếp`,
      [
        `Toán tử in với string trả về boolean: True hoặc False.`,
        `"abc" xuất hiện trong "xyzabcdef" bắt đầu từ vị trí 3.`,
        `Do đó kết quả là True.`,
      ],
      [
        `False sai vì thật sự có chuỗi con "abc".`,
        `"abc" sai vì biểu thức dùng in trả về boolean, không trả về chính chuỗi con.`,
        `Lỗi sai vì cú pháp hoàn toàn hợp lệ.`,
      ],
      `Hãy đọc “x in y” thành “x có nằm trong y không?”.`
    ),
  },
  {
    q: `Kết quả của "AB" in "aAbBc" là gì?`,
    opts: [`True`, `False`],
    ans: 1,
    explain: makeExplain(
      `Đáp án đúng là False vì Python phân biệt chữ hoa và chữ thường.`,
      `"aAbBc"
 01234

Các cặp 2 ký tự:
aA
Ab
bB
Bc

Không có "AB"`,
      [
        `Python so sánh string theo đúng từng ký tự.`,
        `"A" khác "a" và "B" khác "b".`,
        `Trong xâu chỉ có "Ab", không có "AB" liền nhau.`,
      ],
      [
        `True sai vì nhìn lướt thấy A và B xuất hiện, nhưng không đúng thứ tự hoa-thường cần thiết.`,
      ],
      `String comparison trong Python là case-sensitive.`
    ),
  },
  {
    q: `Kết quả của 1 in ["0", "1", "01", "10"] là gì?`,
    opts: [`True`, `False`],
    ans: 1,
    explain: makeExplain(
      `Đáp án đúng là False vì số nguyên 1 khác chuỗi "1".`,
      `Danh sách A = ["0", "1", "01", "10"]

Kiểu dữ liệu:
1    -> int
"1"  -> str

int khác str`,
      [
        `Toán tử in với list kiểm tra phần tử có nằm trong list hay không.`,
        `List đang chứa toàn bộ phần tử kiểu str.`,
        `Giá trị 1 là kiểu int nên không khớp với bất kỳ phần tử nào.`,
      ],
      [
        `True sai vì nhiều bạn chỉ nhìn nội dung “1” mà quên so kiểu dữ liệu.`,
      ],
      `Trong Python, cùng “hình dạng” chưa đủ, kiểu dữ liệu cũng phải khớp.`
    ),
  },
  {
    q: `Đoạn code sau in ra gì?\ns = "81723"\nskq = ""\nfor ch in s:\n    if int(ch) % 2 != 0:\n        skq = skq + ch\nprint(skq)`,
    opts: [`"173"`, `173`, `"827"`, `"81723"`],
    ans: 0,
    explain: makeExplain(
      `Đáp án đúng là "173". Đoạn code lọc các ký tự là chữ số lẻ rồi nối lại thành một xâu mới.`,
      `Trace:
ch = '8' -> 8 chẵn -> bỏ
ch = '1' -> 1 lẻ   -> skq = "1"
ch = '7' -> 7 lẻ   -> skq = "17"
ch = '2' -> 2 chẵn -> bỏ
ch = '3' -> 3 lẻ   -> skq = "173"`,
      [
        `Biến skq ban đầu là xâu rỗng "".`,
        `Mỗi ký tự ch được đổi sang số bằng int(ch).`,
        `Nếu số đó lẻ thì nối ký tự ch vào cuối skq.`,
        `Sau vòng lặp, skq chứa "173".`,
      ],
      [
        `173 sai kiểu vì kết quả in ra vẫn là string, không phải int.`,
        `"827" sai vì đó không phải tập các chữ số lẻ.`,
        `"81723" sai vì code không giữ lại chữ số chẵn.`,
      ],
      `Nếu biến khởi tạo là "", kết quả cuối thường vẫn là string.`
    ),
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
    explain: makeExplain(
      `Đáp án đúng là for i in range(len(s)): print(s[i]) vì i cần chạy qua các chỉ số hợp lệ của xâu.`,
      `s = "Python"
len(s) = 6
range(len(s)) -> 0, 1, 2, 3, 4, 5
s[i]          -> 'P', 'y', 't', 'h', 'o', 'n'`,
      [
        `Muốn dùng s[i], biến i phải là số nguyên chỉ số.`,
        `range(len(s)) tạo ra dãy chỉ số từ 0 đến 5.`,
        `Mỗi lần lặp, print(s[i]) sẽ in đúng một ký tự.`,
      ],
      [
        `for i in s: print(s[i]) sai vì i lúc này là ký tự, không phải chỉ số.`,
        `for i in len(s): ... sai vì len(s) là số nguyên, không iterable.`,
        `for i in range(s): ... sai vì s là string, range không nhận string.`,
      ],
      `Nếu dùng s[i] thì i phải là index.`
    ),
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
    explain: makeExplain(
      `Đáp án đúng là: cách 1 cho i là chỉ số, còn cách 2 cho ch là ký tự thực tế.`,
      `Cách 1:
for i in range(len(s)):
    print(i, s[i])

Cách 2:
for ch in s:
    print(ch)`,
      [
        `range(len(s)) sinh ra dãy số 0,1,2,...`,
        `Do đó i là index, thích hợp khi cần biết vị trí ký tự.`,
        `for ch in s duyệt trực tiếp giá trị ký tự, thích hợp khi không cần vị trí.`,
      ],
      [
        `“Không có khác biệt” sai vì vai trò biến lặp khác nhau.`,
        `“Cách 1 nhanh hơn” không phải khác biệt chính ở mức kiến thức phổ thông.`,
        `“Cách 2 chỉ dùng được với danh sách” sai vì string cũng iterable.`,
      ],
      `Cần vị trí thì dùng index loop, chỉ cần giá trị thì dùng direct iteration.`
    ),
  },
  {
    q: `Cho s = "abcdef". Đoạn code sau in ra gì?\nkq = ""\nfor i in range(3):\n    kq = kq + s[i]\nprint(kq)`,
    opts: [`"abc"`, `"def"`, `"abcdef"`, `Lỗi`],
    ans: 0,
    explain: makeExplain(
      `Đáp án đúng là "abc" vì vòng lặp chỉ lấy 3 ký tự đầu tiên của xâu.`,
      `range(3) -> 0, 1, 2

i = 0 -> kq = ""  + "a" = "a"
i = 1 -> kq = "a" + "b" = "ab"
i = 2 -> kq = "ab"+ "c" = "abc"`,
      [
        `Biến kq khởi đầu là xâu rỗng.`,
        `range(3) cho ba giá trị 0, 1, 2.`,
        `Code lần lượt nối s[0], s[1], s[2] vào kq.`,
        `Kết quả cuối là "abc".`,
      ],
      [
        `"def" sai vì đó là phần cuối xâu.`,
        `"abcdef" sai vì vòng lặp không chạy hết len(s).`,
        `Lỗi sai vì các chỉ số 0,1,2 đều hợp lệ.`,
      ],
      `range(3) luôn có đúng 3 lượt: 0, 1, 2.`
    ),
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
    explain: makeExplain(
      `Đáp án đúng là duyệt từng ký tự ch rồi kiểm tra ch có nằm trong "0123456789" hay không.`,
      `Ý tưởng:
for ch in S:
    if ch in "0123456789":
        # S có chứa chữ số`,
      [
        `Ta cần kiểm tra “có ít nhất một ký tự là chữ số”.`,
        `Cách ổn định nhất là đi từng ký tự.`,
        `Nếu gặp một ký tự thuộc tập "0123456789" thì kết luận ngay là có chữ số.`,
      ],
      [
        `S == "0123456789" sai vì đang so cả xâu với đúng 10 chữ số theo thứ tự đó.`,
        `"0123456789" in S sai vì gần như không bao giờ yêu cầu cả chuỗi 10 ký tự liên tiếp ấy.`,
        `int(S) > 0 sai vì S có thể chứa chữ cái hoặc dấu cách, lúc đó int(S) gây lỗi.`,
      ],
      `Khi đề hỏi “có chứa ... không”, tư duy đúng là scan từng ký tự hoặc dùng membership đúng hướng.`
    ),
  },
  {
    q: `Cho s1 = "abc", s2 = "ababcabca".\nGiá trị của s1 + s1 in s2 là gì?`,
    opts: [`True`, `False`, `"abcabc"`, `Lỗi`],
    ans: 0,
    explain: makeExplain(
      `Đáp án đúng là True. Python sẽ tính s1 + s1 trước, rồi mới kiểm tra kết quả đó có nằm trong s2 hay không.`,
      `s1 = "abc"
s1 + s1 = "abcabc"

s2 = "ababcabca"
      abcabc
=> tìm thấy`,
      [
        `Toán tử + ghép hai string thành một string mới.`,
        `s1 + s1 tạo ra "abcabc".`,
        `Sau đó biểu thức trở thành "abcabc" in "ababcabca".`,
        `Vì chuỗi con này có xuất hiện nên kết quả là True.`,
      ],
      [
        `"abcabc" sai vì biểu thức dùng in trả về boolean, không trả về chuỗi.`,
        `False sai vì thật sự có xuất hiện chuỗi con đó.`,
        `Lỗi sai vì cú pháp hợp lệ.`,
      ],
      `Hãy đọc biểu thức này thành: (s1 + s1) in s2.`
    ),
  },
  {
    q: `Xâu rỗng "" có độ dài bao nhiêu?`,
    opts: [`0`, `1`, `None`, `Lỗi`],
    ans: 0,
    explain: makeExplain(
      `Đáp án đúng là 0 vì xâu rỗng không chứa bất kỳ ký tự nào.`,
      `"" 
Không có ký tự nào bên trong
=> len("") = 0`,
      [
        `len() dùng để đếm số ký tự.`,
        `Xâu rỗng nghĩa là số ký tự bằng 0.`,
        `Do đó len("") trả về 0.`,
      ],
      [
        `1 sai vì nhiều bạn lầm tưởng cặp dấu nháy được tính là ký tự, nhưng không phải.`,
        `None sai vì len() luôn trả về số nguyên với string hợp lệ.`,
        `Lỗi sai vì đây là cú pháp bình thường.`,
      ],
      `Dấu nháy chỉ là ký hiệu viết literal, không phải nội dung của string.`
    ),
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
    explain: makeExplain(
      `Đáp án đúng là: code kiểm tra S có chứa xâu con "10" hay không.`,
      `Duyệt từng cặp liên tiếp:
S[i]   S[i+1]
 "1" +  "0"   -> gặp "10"`,
      [
        `Vòng lặp chạy từ i = 0 đến i = len(S)-2 để luôn còn cặp S[i], S[i+1].`,
        `Mỗi bước kiểm tra xem hai ký tự liên tiếp có lần lượt là "1" và "0" không.`,
        `Nếu có, đặt kq = True rồi break ngay.`,
      ],
      [
        `“S chứa số 10 kiểu int” sai vì code đang so từng ký tự string, không xử lý số int.`,
        `“S bắt đầu bằng 10” sai vì code kiểm tra toàn bộ xâu, không chỉ vị trí đầu.`,
        `“S có đúng 10 ký tự” sai hoàn toàn khác mục tiêu của code.`,
      ],
      `Pattern này tương đương với "10" in S.`
    ),
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
    explain: makeExplain(
      `Đáp án đúng là tách s2 thành hai phần rồi ghép lại: nửa đầu + s1 + nửa sau.`,
      `s2 = "abcdef"
len(s2)//2 = 3

nửa đầu = "abc"
nửa sau  = "def"

kết quả = "abc" + s1 + "def"`,
      [
        `String là immutable nên không thể insert hoặc gán trực tiếp vào giữa.`,
        `Ta phải tạo ra một string mới từ các phần cũ.`,
        `Lấy đoạn trước vị trí giữa, chèn s1, rồi nối tiếp đoạn sau.`,
      ],
      [
        `s2[len(s2)//2] = s1 sai vì string không gán từng vị trí được.`,
        `s2.insert(...) sai vì string không có method insert như list.`,
        `s2 = s1 + s2 sai vì chỉ nối vào đầu, không phải chèn vào giữa.`,
      ],
      `Muốn “sửa” string, hãy nghĩ theo hướng tạo string mới.`
    ),
  }
];

const sections = [
  {
    id: "1",
    tab: "Xâu ký tự",
    title: "1. Xâu là một dãy các ký tự",
    blocks: [
      {
        type: "text",
        content: `Xâu ký tự (string) là một dãy các ký tự, đặt trong dấu nháy đơn ' ' hoặc nháy kép " ". Xâu có thể truy cập từng ký tự bằng chỉ số, đếm từ 0 giống hệt danh sách.`,
      },
      {
        type: "code",
        title: "Tạo xâu và truy cập ký tự",
        code: `s = "Thời khoá biểu"

# Ký tự:  T  h  ờ  i     k  h  o  á     b  i  ể  u
# Chỉ số: 0  1  2  3  4  5  6  7  8  9 10 11 12 13

print(len(s))     # 14 — đếm cả dấu cách
print(s[0])       # 'T' — ký tự đầu tiên
print(s[10])      # 'b' — ký tự ở chỉ số 10`,
        output: `14
T
b`,
      },
      {
        type: "note",
        content: `Dấu cách cũng là một ký tự và cũng có chỉ số riêng. Khi đếm len(), nhớ đếm cả dấu cách.`,
      },
      {
        type: "text",
        content: `Điểm khác biệt lớn nhất giữa xâu và danh sách: xâu KHÔNG THỂ thay đổi từng ký tự (bất biến). Danh sách thì có thể.`,
      },
      {
        type: "code",
        title: "Xâu bất biến — không sửa được từng ký tự",
        code: `# Danh sách — sửa được
d = ["a", "b", "c"]
d[0] = "A"              # OK
print(d)                # ["A", "b", "c"]

# Xâu — KHÔNG sửa được
s = "abc"
# s[0] = "A"            # Lỗi TypeError!
# Muốn "sửa" xâu -> phải tạo xâu mới`,
        output: `['A', 'b', 'c']`,
      },
      {
        type: "note",
        content: `Xâu = chữ khắc trên đá (chỉ đọc). Danh sách = bảng viết phấn (đọc và sửa thoải mái).`,
      },
    ],
    questions: [
      {
        q: `Các xâu sau có hợp lệ không?
a) "123&*()+-ABC"
b) "1010110&0101001"
c) "Tây Nguyên"
d) 11111111 = 256`,
        a: makeExplain(
          `Ba xâu đầu hợp lệ, mục d không hợp lệ vì không được đặt trong dấu nháy.`,
          `a) "123&*()+-ABC"    -> hợp lệ
b) "1010110&0101001" -> hợp lệ
c) "Tây Nguyên"      -> hợp lệ
d) 11111111 = 256    -> không phải string`,
          [
            `Một string chỉ cần được bao quanh bởi dấu nháy và chứa nội dung hợp lệ bên trong.`,
            `Python hỗ trợ Unicode nên tiếng Việt có dấu vẫn là string bình thường.`,
            `Biểu thức không có dấu nháy không được xem là string literal.`,
          ],
          [
            `Nhiều bạn nghĩ chỉ chữ cái mới được nằm trong string, điều đó sai.`,
            `Số, ký tự đặc biệt và dấu cách đều có thể nằm trong string.`,
          ],
          `Điều kiện nhận diện string nhanh nhất là kiểm tra dấu nháy.`,
        ),
      },
      {
        q: `Mỗi xâu hợp lệ ở trên có độ dài bao nhiêu?`,
        a: makeExplain(
          `Độ dài lần lượt là 12, 15 và 10.`,
          `"123&*()+-ABC"    -> 12 ký tự
"1010110&0101001" -> 15 ký tự
"Tây Nguyên"      -> 10 ký tự`,
          [
            `Đếm trực tiếp từng ký tự trong string.`,
            `Dấu cách trong "Tây Nguyên" cũng được tính là 1 ký tự.`,
            `Chữ cái tiếng Việt có dấu vẫn tính là 1 ký tự mỗi chữ.`,
          ],
          [],
          `len() đếm ký tự chứ không đếm “tiếng” hay “từ”.`
        ),
      },
    ],
  },
  {
    id: "2",
    tab: "Duyệt xâu",
    title: "2. Lệnh duyệt ký tự của xâu",
    blocks: [
      {
        type: "text",
        content: `Có hai cách duyệt xâu, giống hệt danh sách. Cách 1 dùng chỉ số (khi cần biết vị trí), cách 2 duyệt trực tiếp ký tự (khi chỉ cần giá trị).`,
      },
      {
        type: "code",
        title: "Cách 1: Duyệt theo chỉ số",
        code: `s = "Thời khoá biểu"

for i in range(len(s)):      # i = 0, 1, 2, ..., 13
    print(s[i], end=" ")     # Phải viết s[i] để lấy ký tự`,
        output: `T h ờ i   k h o á   b i ể u`,
      },
      {
        type: "code",
        title: "Cách 2: Duyệt trực tiếp ký tự",
        code: `s = "Thời khoá biểu"

for ch in s:                 # ch lần lượt = 'T', 'h', 'ờ', ...
    print(ch, end=" ")       # In thẳng ch, KHÔNG viết s[ch]`,
        output: `T h ờ i   k h o á   b i ể u`,
      },
      {
        type: "note",
        content: `Cách 1: i là số nhà -> gõ cửa s[i] mới gặp người.
Cách 2: ch là người đã bước ra -> nói chuyện thẳng, không gõ cửa.`,
      },
      {
        type: "text",
        content: `Toán tử in với xâu có thể kiểm tra cả ký tự đơn lẻ lẫn xâu con (nhiều ký tự liên tiếp).`,
      },
      {
        type: "code",
        title: "Toán tử in — kiểm tra xâu con",
        code: `print("a" in "abcd")        # True — ký tự 'a' có trong xâu
print("abc" in "abcd")      # True — xâu con "abc" có trong xâu
print("xyz" in "abcd")      # False

# Chú ý: khác kiểu = khác nhau
A = ["0", "1", "01", "10"]
print(1 in A)               # False — số 1 khác chuỗi "1"
print("01" in A)            # True  — chuỗi so chuỗi`,
        output: `True
True
False
False
True`,
      },
    ],
    questions: [
      {
        q: `Sau khi thực hiện, biến skq có giá trị gì?

s = "81723"
skq = ""
for ch in s:
    if int(ch) % 2 != 0:
        skq = skq + ch`,
        a: makeExplain(
          `Giá trị cuối cùng của skq là "173".`,
          `Trace:
'8' -> chẵn -> bỏ
'1' -> lẻ   -> "1"
'7' -> lẻ   -> "17"
'2' -> chẵn -> "17"
'3' -> lẻ   -> "173"`,
          [
            `Vòng lặp duyệt từng ký tự trong xâu.`,
            `int(ch) chuyển ký tự số sang số nguyên để kiểm tra chẵn lẻ.`,
            `Chỉ các chữ số lẻ mới được nối vào skq.`,
          ],
          [],
          `Khi biến khởi tạo là "", kết quả sau khi cộng nối vẫn là string.`
        ),
      },
      {
        q: `Cho s1 = "abc", s2 = "ababcabca". Đúng hay sai?
a) s1 in s2
b) s1 + s1 in s2
c) "abcabca" in s2
d) "abc123" in s2`,
        a: makeExplain(
          `Kết quả lần lượt là: a) True, b) True, c) True, d) False.`,
          `s2 = "ababcabca"

Vị trí:
0 1 2 3 4 5 6 7 8
a b a b c a b c a

"abc"     -> có
"abcabc"  -> có
"abcabca" -> có
"abc123"  -> không`,
          [
            `Dùng toán tử in để kiểm tra từng chuỗi con.`,
            `Chuỗi "abc" bắt đầu từ vị trí 2.`,
            `"abcabc" và "abcabca" cũng xuất hiện liên tiếp trong s2.`,
            `"abc123" không thể xuất hiện vì s2 không có chữ số.`,
          ],
          [],
          `Membership test chỉ cần chuỗi con xuất hiện liên tiếp là đủ.`
        ),
      },
    ],
  },
  {
    id: "3",
    tab: "Thực hành",
    title: "Thực hành: Các lệnh cơ bản với xâu",
    blocks: [
      {
        type: "text",
        content: `Nhiệm vụ 1: Nhập n tên học sinh, lưu vào danh sách, in ra mỗi tên trên một dòng.`,
      },
      {
        type: "code",
        title: "Nhiệm vụ 1 — Nhập và in danh sách tên",
        code: `n = int(input("Nhập số học sinh trong lớp: "))
ds_lop = []

for i in range(n):
    hoten = input("Nhập họ tên học sinh thứ " + str(i+1) + ": ")
    ds_lop.append(hoten)

print("Danh sách lớp học:")
for i in range(n):
    print(ds_lop[i])`,
        output: `Nhập số học sinh trong lớp: 3
Nhập họ tên học sinh thứ 1: Nguyễn Văn An
Nhập họ tên học sinh thứ 2: Trần Thị Bình
Nhập họ tên học sinh thứ 3: Lê Văn Cường
Danh sách lớp học:
Nguyễn Văn An
Trần Thị Bình
Lê Văn Cường`,
      },
      {
        type: "text",
        content: `Nhiệm vụ 2: Kiểm tra xâu S có chứa xâu con "10" không. Sách dạy 2 cách.`,
      },
      {
        type: "code",
        title: "Cách 1 — Duyệt theo chỉ số",
        code: `S = input("Nhập xâu ký tự bất kì: ")
kq = False

for i in range(len(S) - 1):
    if S[i] == "1" and S[i+1] == "0":
        kq = True
        break

if kq:
    print("Xâu gốc có chứa xâu '10'")
else:
    print("Xâu gốc không chứa xâu '10'")`,
        output: `Nhập xâu ký tự bất kì: ab10c
Xâu gốc có chứa xâu '10'`,
      },
      {
        type: "code",
        title: "Cách 2 — Dùng toán tử in",
        code: `S = input("Nhập xâu ký tự bất kì: ")
s10 = "10"

if s10 in S:
    print("Xâu gốc có chứa xâu '10'")
else:
    print("Xâu gốc không chứa xâu '10'")`,
        output: `Nhập xâu ký tự bất kì: ab10c
Xâu gốc có chứa xâu '10'`,
      },
      {
        type: "note",
        content: `Trong bài thi, ưu tiên cách 2 vì ngắn và ít lỗi. Nhưng cần hiểu cách 1 để truy vết khi đề cho code.`,
      },
    ],
    questions: [],
  },
  {
    id: "4",
    tab: "Luyện tập",
    title: "Luyện tập",
    blocks: [
      {
        type: "text",
        content: `Hai bài luyện tập áp dụng kiến thức duyệt xâu và toán tử in.`,
      },
    ],
    questions: [
      {
        q: `Bài 1: Cho xâu S, viết đoạn lệnh trích ra xâu con gồm 3 ký tự đầu tiên của S.`,
        a: makeExplain(
          `Ý tưởng là duyệt tối đa 3 vị trí đầu của xâu và nối từng ký tự vào xau_con.`,
          `S = input("Nhập xâu: ")
xau_con = ""

so_ky_tu = 3
if len(S) < 3:
    so_ky_tu = len(S)

for i in range(so_ky_tu):
    xau_con = xau_con + S[i]

print("3 ký tự đầu:", xau_con)`,
          [
            `Nếu S ngắn hơn 3 ký tự thì không được truy cập quá độ dài thật.`,
            `Biến so_ky_tu giúp tránh IndexError.`,
            `Sau đó dùng vòng lặp để ghép lần lượt các ký tự đầu.`,
          ],
          [],
          `Đây là cách “thủ công” để hiểu bản chất trước khi học slicing.`
        ),
      },
      {
        q: `Bài 2: Viết chương trình kiểm tra xâu S có chứa chữ số không.
Thông báo "S có chứa chữ số" hoặc "S không chứa chữ số nào".`,
        a: makeExplain(
          `Ta duyệt từng ký tự và kiểm tra membership trong chuỗi "0123456789".`,
          `S = input("Nhập xâu: ")
co_chu_so = False

for ch in S:
    if ch in "0123456789":
        co_chu_so = True
        break

if co_chu_so:
    print("S có chứa chữ số")
else:
    print("S không chứa chữ số nào")`,
          [
            `Mỗi ký tự được xét độc lập.`,
            `Nếu gặp một chữ số, ta gán cờ co_chu_so = True.`,
            `Dùng break để dừng sớm, tránh duyệt thừa.`,
          ],
          [],
          `Đây là pattern rất hay gặp: scan + flag + break.`
        ),
      },
    ],
  },
  {
    id: "5",
    tab: "Vận dụng",
    title: "Vận dụng",
    blocks: [
      {
        type: "text",
        content: `Hai bài vận dụng nâng cao: chèn xâu vào giữa, và đếm tên trong danh sách.`,
      },
    ],
    questions: [
      {
        q: `Bài 1: Cho hai xâu s1, s2. Chèn s1 vào giữa s2 tại vị trí len(s2)//2.
In kết quả ra màn hình.`,
        a: makeExplain(
          `Ta chia s2 thành hai nửa rồi ghép lại với s1 ở giữa.`,
          `s1 = input("Nhập s1: ")
s2 = input("Nhập s2: ")
giua = len(s2) // 2

nua_dau = ""
for i in range(giua):
    nua_dau = nua_dau + s2[i]

nua_sau = ""
for i in range(giua, len(s2)):
    nua_sau = nua_sau + s2[i]

ket_qua = nua_dau + s1 + nua_sau
print("Kết quả:", ket_qua)`,
          [
            `giua là vị trí chèn.`,
            `Dùng một vòng lặp lấy nửa đầu, một vòng lặp lấy nửa sau.`,
            `Cuối cùng nối nua_dau + s1 + nua_sau.`,
          ],
          [],
          `Muốn sửa string, hãy tách và ghép, không gán trực tiếp từng vị trí.`
        ),
      },
      {
        q: `Bài 2: Nhập số học sinh và họ tên. Đếm bao nhiêu bạn tên "Hương".
Gợi ý: dùng toán tử in.`,
        a: makeExplain(
          `Ta lưu danh sách tên, sau đó duyệt từng tên và kiểm tra "Hương" in ten.`,
          `n = int(input("Nhập số học sinh: "))
ds = []

for i in range(n):
    hoten = input("Nhập họ tên thứ " + str(i+1) + ": ")
    ds.append(hoten)

dem = 0
for ten in ds:
    if "Hương" in ten:
        dem = dem + 1

print("Số bạn tên Hương:", dem)`,
          [
            `Vòng lặp đầu dùng để nhập dữ liệu.`,
            `Vòng lặp sau dùng để thống kê.`,
            `Nếu chuỗi "Hương" xuất hiện trong họ tên thì tăng biến đếm lên 1.`,
          ],
          [],
          `Toán tử in không chỉ dùng cho 1 ký tự mà còn dùng cho cả chuỗi con.`
        ),
      },
    ],
  },
];

function VisualBox({ title = "Minh họa trực quan", content }) {
  if (!content) return null;

  return (
    <div
      style={{
        marginTop: 10,
        padding: "12px 14px",
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#1d4ed8",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 0.3,
        }}
      >
        {title}
      </div>
      <pre
        style={{
          margin: 0,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          lineHeight: 1.6,
          color: "#1e3a8a",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {content}
      </pre>
    </div>
  );
}

function ExplanationPanel({ data, header, subheader }) {
  const info = normalizeExplain(data);
  const hasAny =
    info.summary ||
    info.visual ||
    info.steps.length > 0 ||
    info.wrongs.length > 0 ||
    info.takeaway ||
    header ||
    subheader;

  if (!hasAny) return null;

  return (
    <div
      style={{
        marginTop: 10,
        padding: "12px 16px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
      }}
    >
      {header && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#166534",
            marginBottom: 6,
          }}
        >
          {header}
        </div>
      )}

      {subheader && (
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 8,
          }}
        >
          {subheader}
        </div>
      )}

      {info.summary && (
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: "#374151",
            whiteSpace: "pre-wrap",
          }}
        >
          {info.summary}
        </div>
      )}

      <VisualBox content={info.visual} />

      {info.steps.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#1f2937",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            Phân tích từng bước
          </div>
          <ol
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 13,
              lineHeight: 1.7,
              color: "#374151",
            }}
          >
            {info.steps.map((step, index) => (
              <li key={index} style={{ marginBottom: 4 }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {info.wrongs.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#92400e",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            Lỗi sai thường gặp
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "#7c2d12" }}>
            {info.wrongs.map((wrong, index) => (
              <div key={index}>• {wrong}</div>
            ))}
          </div>
        </div>
      )}

      {info.takeaway && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "#ecfdf5",
            border: "1px solid #bbf7d0",
            borderRadius: 8,
            fontSize: 13,
            lineHeight: 1.65,
            color: "#166534",
          }}
        >
          <strong>Chốt nhớ nhanh:</strong> {info.takeaway}
        </div>
      )}
    </div>
  );
}

function CodeBox({ title, code, output }) {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        marginBottom: 14,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {title && (
        <div
          style={{
            padding: "8px 14px",
            background: "#f3f4f6",
            borderBottom: "1px solid #e5e7eb",
            fontSize: 13,
            fontWeight: 600,
            color: "#374151",
          }}
        >
          {title}
        </div>
      )}

      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          lineHeight: 1.65,
          overflowX: "auto",
          background: "#fafafa",
          color: "#1f2937",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {code}
      </pre>

      {output && (
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            padding: "8px 14px",
            background: "#fff",
          }}
        >
          <button
            onClick={() => setShow(!show)}
            style={{
              background: show ? "#059669" : "#2563eb",
              color: "#fff",
              border: "none",
              padding: "6px 16px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {show ? "Ẩn kết quả" : "Chạy thử"}
          </button>

          {show && (
            <pre
              style={{
                marginTop: 10,
                padding: "10px 14px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                lineHeight: 1.6,
                color: "#166534",
                whiteSpace: "pre-wrap",
              }}
            >
              {output}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function NoteBox({ content }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: 8,
        marginBottom: 14,
        fontSize: 14,
        lineHeight: 1.65,
        color: "#92400e",
        whiteSpace: "pre-wrap",
      }}
    >
      <span style={{ marginRight: 8 }}>💡</span>
      {content}
    </div>
  );
}

function Question({ q, a, idx }) {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        marginBottom: 12,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div style={{ padding: "12px 16px" }}>
        <div
          style={{
            display: "inline-block",
            background: "#dbeafe",
            color: "#1e40af",
            padding: "2px 12px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          Câu {idx + 1}
        </div>

        <pre
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            lineHeight: 1.65,
            color: "#1f2937",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0,
            background: "#f9fafb",
            padding: "10px 14px",
            borderRadius: 6,
          }}
        >
          {q}
        </pre>
      </div>

      <div style={{ padding: "0 16px 14px" }}>
        <button
          onClick={() => setShow(!show)}
          style={{
            background: show ? "#f3f4f6" : "#fff",
            color: show ? "#059669" : "#2563eb",
            border: `1px solid ${show ? "#d1d5db" : "#bfdbfe"}`,
            padding: "6px 16px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {show ? "Ẩn lời giải chi tiết" : "Xem lời giải chi tiết"}
        </button>

        {show && <ExplanationPanel data={a} />}
      </div>
    </div>
  );
}

function QuizTab() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplain, setShowExplain] = useState({});

  const pick = (qi, oi) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [qi]: oi }));
    }
  };

  const score = Object.keys(answers).reduce(
    (sum, key) => sum + (answers[key] === quizData[Number(key)].ans ? 1 : 0),
    0
  );
  const answered = Object.keys(answers).length;
  const total = quizData.length;

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowExplain({});
  };

  return (
    <div>
      {submitted && (
        <div
          style={{
            padding: "16px 20px",
            background:
              score >= 16 ? "#f0fdf4" : score >= 10 ? "#fffbeb" : "#fef2f2",
            border: `1px solid ${
              score >= 16 ? "#bbf7d0" : score >= 10 ? "#fde68a" : "#fecaca"
            }`,
            borderRadius: 8,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color:
                score >= 16 ? "#166534" : score >= 10 ? "#92400e" : "#991b1b",
            }}
          >
            {score} / {total}
          </div>

          <div
            style={{
              fontSize: 14,
              color:
                score >= 16 ? "#166534" : score >= 10 ? "#92400e" : "#991b1b",
              marginTop: 4,
            }}
          >
            {score >= 18
              ? "Xuất sắc!"
              : score >= 16
              ? "Giỏi lắm!"
              : score >= 12
              ? "Khá tốt, cần ôn thêm."
              : score >= 8
              ? "Trung bình, xem lại lý thuyết."
              : "Cần ôn lại kỹ hơn nhé!"}
          </div>

          <button
            onClick={reset}
            style={{
              marginTop: 12,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "8px 20px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Làm lại
          </button>
        </div>
      )}

      {quizData.map((item, qi) => {
        const picked = answers[qi];
        const isCorrect = picked === item.ans;
        const sr = submitted;
        const correctLabel = `${String.fromCharCode(65 + item.ans)}. ${item.opts[item.ans]}`;
        const pickedLabel =
          picked !== undefined
            ? `${String.fromCharCode(65 + picked)}. ${item.opts[picked]}`
            : "Chưa chọn";

        return (
          <div
            key={qi}
            style={{
              border: `1px solid ${
                sr ? (isCorrect ? "#bbf7d0" : "#fecaca") : "#d1d5db"
              }`,
              borderRadius: 8,
              marginBottom: 12,
              background: "#fff",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "14px 16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    background: sr
                      ? isCorrect
                        ? "#dcfce7"
                        : "#fee2e2"
                      : "#f3f4f6",
                    color: sr
                      ? isCorrect
                        ? "#166534"
                        : "#991b1b"
                      : "#6b7280",
                    padding: "2px 12px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Câu {qi + 1}
                </span>
                {sr && <span style={{ fontSize: 14 }}>{isCorrect ? "✅" : "❌"}</span>}
              </div>

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "#1f2937",
                  whiteSpace: "pre-wrap",
                  ...(item.q.includes("\n")
                    ? {
                        fontFamily: "'JetBrains Mono', monospace",
                        background: "#f9fafb",
                        padding: "10px 14px",
                        borderRadius: 6,
                        fontSize: 13,
                      }
                    : {}),
                }}
              >
                {item.q}
              </div>
            </div>

            <div
              style={{
                padding: "0 16px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {item.opts.map((opt, oi) => {
                const isThis = picked === oi;
                const isAns = item.ans === oi;
                let bg = "#f9fafb";
                let border = "1px solid #e5e7eb";
                let color = "#374151";

                if (sr) {
                  if (isAns) {
                    bg = "#dcfce7";
                    border = "1px solid #86efac";
                    color = "#166534";
                  } else if (isThis && !isCorrect) {
                    bg = "#fee2e2";
                    border = "1px solid #fca5a5";
                    color = "#991b1b";
                  }
                } else if (isThis) {
                  bg = "#dbeafe";
                  border = "1px solid #93c5fd";
                  color = "#1e40af";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => pick(qi, oi)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "10px 14px",
                      background: bg,
                      border,
                      borderRadius: 6,
                      cursor: sr ? "default" : "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      fontSize: 14,
                      lineHeight: 1.5,
                      color,
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        border: `2px solid ${
                          isThis
                            ? sr
                              ? isAns
                                ? "#22c55e"
                                : "#ef4444"
                              : "#3b82f6"
                            : "#d1d5db"
                        }`,
                        background: isThis
                          ? sr
                            ? isAns
                              ? "#22c55e"
                              : "#ef4444"
                            : "#3b82f6"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 11,
                        color: isThis ? "#fff" : "#9ca3af",
                        fontWeight: 700,
                        marginTop: 1,
                      }}
                    >
                      {isThis ? "✓" : String.fromCharCode(65 + oi)}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {sr && (
              <div style={{ padding: "0 16px 14px" }}>
                <button
                  onClick={() =>
                    setShowExplain((prev) => ({ ...prev, [qi]: !prev[qi] }))
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                  }}
                >
                  {showExplain[qi] ? "Ẩn giải thích chi tiết" : "Xem giải thích chi tiết"}
                </button>

                {showExplain[qi] && (
                  <ExplanationPanel
                    header={`Đáp án đúng: ${correctLabel}`}
                    subheader={`Bạn đã chọn: ${pickedLabel}`}
                    data={item.explain}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
            Đã chọn {answered} / {total} câu
          </div>

          <button
            onClick={() => answered > 0 && setSubmitted(true)}
            disabled={answered === 0}
            style={{
              background: answered === 0 ? "#e5e7eb" : "#2563eb",
              color: answered === 0 ? "#9ca3af" : "#fff",
              border: "none",
              padding: "10px 32px",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              cursor: answered === 0 ? "default" : "pointer",
              fontFamily: "inherit",
            }}
          >
            Nộp bài
          </button>

          {answered > 0 && answered < total && (
            <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 8 }}>
              Còn {total - answered} câu chưa trả lời
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const mainRef = useRef(null);
  const allTabs = [...sections.map((section) => section.tab), "Trắc nghiệm"];

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [tab]);

  const isQuiz = tab === allTabs.length - 1;
  const sec = !isQuiz ? sections[tab] : null;

  return (
    <div
      style={{
        fontFamily: "'Noto Sans', 'Segoe UI', sans-serif",
        background: "#f5f5f5",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#1f2937",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        button { transition: opacity 0.15s ease, transform 0.15s ease; }
        button:hover { opacity: 0.9; }
        pre { tab-size: 4; }
      `}</style>

      <div
        style={{
          background: "#fff",
          borderBottom: "2px solid #2563eb",
          padding: "14px 20px",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1e3a5f" }}>
            Bài 24: Xâu ký tự
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Tin học 11 — Chương trình GDPT 2018
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          overflowX: "auto",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 840,
            margin: "0 auto",
            display: "flex",
            padding: "0 12px",
          }}
        >
          {allTabs.map((t, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              style={{
                background: "none",
                border: "none",
                borderBottom: i === tab ? "3px solid #2563eb" : "3px solid transparent",
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: i === tab ? 700 : 500,
                color: i === tab ? "#2563eb" : "#6b7280",
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div ref={mainRef} style={{ flex: 1, overflowY: "auto", padding: "24px 20px 60px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          {isQuiz ? (
            <>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#1e3a5f",
                  marginBottom: 6,
                  paddingBottom: 12,
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Trắc nghiệm ôn tập — Bài 24
              </h2>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20, lineHeight: 1.7 }}>
                20 câu bao quát toàn bộ kiến thức. Sau khi nộp bài, mỗi câu đều có phần giải thích
                chi tiết, phân tích sai lầm thường gặp và visual minh họa để học sinh tự rà lại tư duy.
              </p>
              <QuizTab />
            </>
          ) : (
            <>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#1e3a5f",
                  marginBottom: 20,
                  paddingBottom: 12,
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                {sec.title}
              </h2>

              {sec.blocks.map((block, i) => {
                if (block.type === "text") {
                  return (
                    <p
                      key={i}
                      style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        color: "#374151",
                        marginBottom: 14,
                      }}
                    >
                      {block.content}
                    </p>
                  );
                }

                if (block.type === "code") {
                  return <CodeBox key={i} title={block.title} code={block.code} output={block.output} />;
                }

                if (block.type === "note") {
                  return <NoteBox key={i} content={block.content} />;
                }

                return null;
              })}

              {sec.questions.length > 0 && (
                <>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#1e40af",
                      marginTop: 28,
                      marginBottom: 14,
                      paddingTop: 16,
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    {tab <= 2 ? "Câu hỏi kiểm tra" : tab === 3 ? "Bài luyện tập" : "Bài vận dụng"}
                  </h3>

                  {sec.questions.map((question, i) => (
                    <Question key={i} q={question.q} a={question.a} idx={i} />
                  ))}
                </>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 32,
                  paddingTop: 16,
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  onClick={() => tab > 0 && setTab(tab - 1)}
                  disabled={tab === 0}
                  style={{
                    background: tab === 0 ? "#f3f4f6" : "#fff",
                    border: "1px solid #d1d5db",
                    color: tab === 0 ? "#9ca3af" : "#374151",
                    padding: "8px 20px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: tab === 0 ? "default" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Phần trước
                </button>

                <span style={{ fontSize: 13, color: "#9ca3af", alignSelf: "center" }}>
                  {tab + 1} / {allTabs.length}
                </span>

                <button
                  onClick={() => tab < allTabs.length - 1 && setTab(tab + 1)}
                  style={{
                    background: "#2563eb",
                    border: "1px solid #2563eb",
                    color: "#fff",
                    padding: "8px 20px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Phần sau →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
