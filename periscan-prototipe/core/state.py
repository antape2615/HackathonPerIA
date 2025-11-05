# core/state.py
import streamlit as st

def init_session_state():
    if "step" not in st.session_state:
        st.session_state["step"] = 1
    if "client" not in st.session_state:
        st.session_state["client"] = ""
    if "sector" not in st.session_state:
        st.session_state["sector"] = ""
    if "problem" not in st.session_state:
        st.session_state["problem"] = ""
    if "parsed" not in st.session_state:
        st.session_state["parsed"] = {}
    if "last_pdf" not in st.session_state:
        st.session_state["last_pdf"] = None
    if "chat_history" not in st.session_state:
        st.session_state["chat_history"] = []
