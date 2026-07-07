const OLIVIA_SCRIPT_ID = "olivia-chat-widget";
const OLIVIA_BASE_URL = "https://olivia.paradox.ai";
const OLIVIA_KEY = "ntsdvrniivyclwbjiojx";
const OLIVIA_WIDGET_SRC =
  "https://dokumfe7mps0i.cloudfront.net/static/site/js/widget-client.js";

const oliviaBootstrap = `
(function(o,l) {
  if (document.getElementById('${OLIVIA_SCRIPT_ID}')) return;
  window.oliviaChatData = window.oliviaChatData || [];
  window.oliviaChatBaseUrl = o;
  window.oliviaChatData.push(['setKey', l]);
  window.oliviaChatData.push(['start']);
  var apply = document.createElement('script');
  apply.id = '${OLIVIA_SCRIPT_ID}';
  apply.type = 'text/javascript';
  apply.async = true;
  apply.src = '${OLIVIA_WIDGET_SRC}';
  apply.onload = function() {
    console.log('Careers Chat script loaded.');
  };
  apply.onerror = function() {
    console.warn('Careers Chat script failed to load.');
  };
  document.body.appendChild(apply);
})('${OLIVIA_BASE_URL}', '${OLIVIA_KEY}');
`;

export default function OliviaChatLoader() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: oliviaBootstrap }}
      id="olivia-chat-loader"
      type="text/javascript"
    />
  );
}
