from fpdf import FPDF
import io

def create_pdf(resume_content: str, profile_image_bytes: bytes = None) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Optional image handling, simplified to avoid issues with temp files for now
    # if profile_image_bytes:
    #     pass

    pdf.set_font("Helvetica", size=11)
    
    for line in resume_content.split('\n'):
        # Handling encoding to avoid FPDF text issues, and strip common markdown
        clean_line = line.replace("**", "").replace("* ", "• ")
        clean_line = clean_line.encode('latin-1', 'replace').decode('latin-1')
        pdf.multi_cell(0, 6, align='L', text=clean_line)
        
    return pdf.output()
