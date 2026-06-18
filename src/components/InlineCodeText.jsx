const CODE_TERMS = ["INNER JOIN", "LEFT JOIN", "NULL"];
const CODE_TERM_PATTERN = new RegExp(`\\b(${CODE_TERMS.join("|")})\\b`, "g");

function InlineCodeText({ text }) {
  return String(text)
    .split(CODE_TERM_PATTERN)
    .map((part, index) =>
      CODE_TERMS.includes(part) ? (
        <code className="inline-code" key={`${part}-${index}`}>
          {part}
        </code>
      ) : (
        part
      ),
    );
}

export default InlineCodeText;
