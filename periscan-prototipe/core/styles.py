# core/styles.py
import streamlit as st

def inject_global_styles():
    st.markdown("""
    <style>
    :root{
      --primary:#4B03FF;
      --accent:#5BC0FF;
      --navy:#0A2342;
      --bg:#F4F7FE;
      --card-border:#DCE5F2;
    }

    .stApp { background: var(--bg) !important; }
    h1, h2, h3 { color: var(--navy) !important; font-family: 'Poppins', 'Inter', sans-serif; }

    .report-card {
        background: white;
        padding: 18px;
        border-radius: 12px;
        border: 1px solid var(--card-border);
        margin-bottom: 18px;
    }

    .brand-pill {
        display:inline-block;
        padding:6px 12px;
        background:var(--accent);
        color:#012;
        border-radius:8px;
        font-weight:700;
        margin-bottom:8px;
    }

    .timeline-bar {
        background: linear-gradient(90deg, #0033A1 0%, #7A1FF6 50%, #00C389 100%);
        height:6px;
        border-radius:6px;
        margin:10px 0;
    }
    </style>
    """, unsafe_allow_html=True)
