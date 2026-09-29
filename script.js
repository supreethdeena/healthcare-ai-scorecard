'use strict';

(() => {
  const QUESTIONS = [
    {d:'AI Strategy',q:'How clearly is AI connected to your organization’s broader strategic priorities?',o:['We are still exploring what AI could mean for us.','AI is discussed, but clear priorities are not established.','We have identified potential use cases and opportunities.','AI initiatives are aligned with specific business objectives.','AI is integrated into our long-term organizational strategy.']},
    {d:'AI Strategy',q:'How does your organization decide which AI initiatives to pursue?',o:['We have not established a process yet.','Decisions are mostly driven by interest or trends.','We evaluate value and feasibility.','We use defined criteria, including impact, risk, and readiness.','We have a structured process for prioritizing AI investments.']},
    {d:'Data Readiness',q:'How accessible is the data needed to support AI initiatives?',o:['Data is fragmented across disconnected systems.','Some data is accessible, but integration is a challenge.','Key datasets are accessible for selected use cases.','Most priority data sources are connected and accessible.','Our infrastructure supports organization-wide AI initiatives.']},
    {d:'Data Readiness',q:'How confident are you in the quality and reliability of your data?',o:['Data quality is a significant concern.','Quality varies across systems and departments.','We have quality checks for some important datasets.','Data quality is regularly monitored and managed.','We have standards, ownership, and accountability across the organization.']},
    {d:'Governance',q:'How prepared is your organization to address privacy, security, and regulatory requirements?',o:['We are still understanding the requirements.','We address concerns case by case.','We have started defining policies for AI risks.','We have processes for reviewing AI initiatives.','Governance is embedded in our processes, with clear accountability.']},
    {d:'Governance',q:'Who is accountable for monitoring AI systems after deployment?',o:['We have not defined ownership.','Responsibility usually falls to the implementing team.','Ownership is defined for some initiatives.','Designated teams or individuals oversee AI systems.','We have ongoing monitoring, clear ownership, and escalation processes.']},
    {d:'Implementation',q:'Where does your organization currently stand in implementing AI?',o:['We have not started exploring applications.','We are researching potential applications.','We are running small experiments or pilots.','We have implemented AI in selected workflows.','AI is used across multiple workflows, with measurable outcomes.']},
    {d:'Implementation',q:'How does your organization evaluate whether an AI implementation is successful?',o:['We have no success criteria.','We primarily check whether the technology works.','We evaluate efficiency or user feedback.','We track defined operational and business outcomes.','We continuously measure outcomes, adoption, risks, and ROI.']},
    {d:'Leadership Alignment',q:'How aligned is your leadership team on AI’s role?',o:['There is little leadership discussion.','Interest exists, but perspectives differ.','We have started discussing shared priorities.','Leadership generally agrees on priorities and responsibilities.','AI has clear executive sponsorship and cross-functional alignment.']},
    {d:'Leadership Alignment',q:'How prepared are employees to work alongside AI-enabled systems?',o:['We have not addressed workforce readiness.','Awareness exists, but preparation is limited.','Some teams have received training.','We have training and change-management initiatives.','Workforce readiness is developed alongside AI implementation.']}
  ];
  const DIMENSIONS = ['AI Strategy','Data Readiness','Governance','Implementation','Leadership Alignment'];
  const ARCHETYPES = [
    {name:'The AI Explorer',tag:'Curious, with foundations still taking shape.',desc:'Your organization is exploring what AI could mean. The next step is to identify a focused problem and build shared understanding.',step:'Start with one meaningful use case.',advice:'Choose a problem that matters to the organization, identify who it affects, and agree on what a useful outcome would look like.',symbol:'✦'},
    {name:'The Strategic Architect',tag:'Turning interest into a direction.',desc:'Your organization is beginning to connect AI opportunities with business priorities.',step:'Turn interest into shared priorities.',advice:'Agree on a small set of priorities, name accountable owners, and define how progress will be measured.',symbol:'⌘'},
    {name:'The Governance Guardian',tag:'Building trust into the approach.',desc:'Your organization is paying attention to the responsibilities that come with AI.',step:'Make governance part of the work.',advice:'Bring business, clinical, legal, security, and data teams into a practical review process early.',symbol:'⬡'},
    {name:'The Data Integrator',tag:'Working on the foundations AI depends on.',desc:'Your organization recognizes the importance of accessible, reliable data.',step:'Map the data behind a priority use case.',advice:'Identify the data sources, owners, quality issues, access requirements, and gaps that could affect the use case.',symbol:'◇'},
    {name:'The AI Pioneer',tag:'Moving from pilots into practice.',desc:'Your organization is putting AI into use and learning from implementation.',step:'Measure what happens after launch.',advice:'Track adoption, workflow impact, safety, performance, and the experience of the people using the system.',symbol:'➤'},
    {name:'The Transformation Catalyst',tag:'Connecting AI across the organization.',desc:'Your responses suggest AI is becoming part of broader operations.',step:'Connect progress across all five dimensions.',advice:'Use your lowest-scoring dimension to guide the next planning discussion, while keeping ownership and outcomes visible.',symbol:'✧'}
  ];
  const $ = id => document.getElementById(id);
  let answers = Array(QUESTIONS.length).fill(0);
  let current = 0;
  let currentResult = null;

  function show(section) {
    ['intro','quiz','result'].forEach(id => $(id).classList.toggle('hidden', id !== section));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function renderQuestion() {
    const item = QUESTIONS[current];
    $('dimension').textContent = item.d;
    $('count').textContent = `${current + 1} / ${QUESTIONS.length}`;
    $('num').textContent = `QUESTION ${String(current + 1).padStart(2,'0')}`;
    $('question').textContent = item.q;
    $('bar').style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;
    $('bar').parentElement.setAttribute('aria-valuenow', String(current + 1));
    $('options').replaceChildren();
    item.o.forEach((label, index) => {
      const wrapper = document.createElement('label');
      wrapper.className = `option${answers[current] === index + 1 ? ' selected' : ''}`;
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'answer'; input.value = String(index + 1);
      input.checked = answers[current] === index + 1;
      input.addEventListener('change', () => {
        answers[current] = index + 1;
        renderQuestion();
      });
      const text = document.createElement('span'); text.textContent = label;
      wrapper.append(input, text); $('options').append(wrapper);
    });
    $('back').disabled = current === 0;
    $('next').disabled = answers[current] === 0;
    $('next').textContent = current === QUESTIONS.length - 1 ? 'See my result ↗' : 'Continue ↗';
  }
  function showResult() {
    const total = answers.reduce((sum, value) => sum + value, 0);
    const index = Math.min(5, Math.floor((total - 10) / 7));
    currentResult = ARCHETYPES[index];
    $('symbol').textContent = currentResult.symbol;
    $('archetype').textContent = currentResult.name;
    $('tagline').textContent = currentResult.tag;
    $('description').textContent = currentResult.desc;
    $('total').textContent = String(total);
    $('nextstep').textContent = currentResult.step;
    $('advice').textContent = currentResult.advice;
    $('dimensions').replaceChildren();
    DIMENSIONS.forEach((dimension, index) => {
      const score = answers[index * 2] + answers[index * 2 + 1];
      const block = document.createElement('div'); block.className = 'dim';
      const head = document.createElement('div'); head.className = 'dimhead';
      const name = document.createElement('span'); name.textContent = dimension;
      const value = document.createElement('b'); value.textContent = `${score}/10`;
      head.append(name, value);
      const track = document.createElement('div'); track.className = 'track';
      const fill = document.createElement('div'); fill.className = 'fill'; fill.style.width = `${score * 10}%`;
      track.append(fill); block.append(head, track); $('dimensions').append(block);
    });
    show('result');
  }
  $('start').addEventListener('click', () => { current = 0; show('quiz'); renderQuestion(); });
  $('back').addEventListener('click', () => { if (current > 0) { current--; renderQuestion(); } });
  $('next').addEventListener('click', () => {
    if (!answers[current]) return;
    if (current < QUESTIONS.length - 1) { current++; renderQuestion(); }
    else showResult();
  });
  $('restart').addEventListener('click', () => { answers = Array(QUESTIONS.length).fill(0); current = 0; currentResult = null; show('intro'); });
  $('share').addEventListener('click', async () => {
    const text = `I got ${currentResult ? currentResult.name : 'an AI Leadership Archetype'} in the Healthcare AI Leadership Archetype scorecard by Healthcare Unstructured.`;
    try {
      if (navigator.share) await navigator.share({title:'My AI Leadership Archetype',text});
      else if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); alert('Share text copied.'); }
      else window.prompt('Copy this text to share:', text);
    } catch (error) { if (error.name !== 'AbortError') window.prompt('Copy this text to share:', text); }
  });
  $('community').addEventListener('click', () => window.open('https://www.linkedin.com/groups/40972012/', '_blank', 'noopener,noreferrer'));
})();
