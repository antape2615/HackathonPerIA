import streamlit as st

st.title("1 — Levantamiento de información")

with st.form("levantar"):
    client = st.text_input("Cliente / Empresa", value=st.session_state.get("client",""))
    sector = st.text_input("Sector", value=st.session_state.get("sector",""))
    problem = st.text_area("Describe el problema", value=st.session_state.get("problem",""), height=240)
    go = st.form_submit_button("➡️ Continuar")

if go:
    st.session_state["client"]=client
    st.session_state["sector"]=sector
    st.session_state["problem"]=problem
    st.session_state["step"]=2
    st.rerun()

if go:
    st.session_state["step"] = 2
    st.rerun()
