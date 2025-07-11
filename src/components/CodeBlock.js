import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ code, language = 'python' }) {
    return (
        <div style={{ position: 'relative'}}>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    borderRadius: '8px',
                    padding: '16px',
                    overflow: 'auto',
                }}
                codeTagProps={{
                    style: { fontSize: '0.8rem' } 
                }}
            >
                {code}
            </SyntaxHighlighter>

        </div>
    );
}
