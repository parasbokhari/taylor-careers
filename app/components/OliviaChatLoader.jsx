const oliviaBootstrap = `
(function(o,l) {
window.oliviaChatData = window.oliviaChatData || [];
window.oliviaChatBaseUrl = o;
window.oliviaChatData.push(['setKey', l]);
window.oliviaChatData.push(['start']);
var apply = document.createElement('script');
apply.type = 'text/javascript';
apply.async = true;
apply.src = 'https://dokumfe7mps0i.cloudfront.net/static/site/js/widget-client.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(apply, s);
})('https://olivia.paradox.ai', 'ntsdvrniivyclwbjiojx');
`;

export default function OliviaChatLoader() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: oliviaBootstrap }}
      type="text/javascript"
    />
  );
}
