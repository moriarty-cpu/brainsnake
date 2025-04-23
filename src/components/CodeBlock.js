import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ code, language = 'python' }) {
    return (
        <div style={{ position: 'relative'}}>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    borderRadius: '10px',
                    padding: '16px',
                    overflow: 'auto',
                }}
                codeTagProps={{
                    style: { fontSize: '40px' } // вот это ключевой момент
                }}
            >
                {code}
            </SyntaxHighlighter>

        </div>
    );
}
