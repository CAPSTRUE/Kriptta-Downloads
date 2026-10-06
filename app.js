const REPO = 'CAPSTRUE/Kriptta-Downloads';
const API = `https://api.github.com/repos/${REPO}/releases/latest`;
const RELEASES = `https://github.com/${REPO}/releases/latest`;

const exeButton = document.querySelector('#downloadExe');
const msiButton = document.querySelector('#downloadMsi');
const status = document.querySelector('#releaseStatus');
const footerVersion = document.querySelector('#footerVersion');
const releasesTop = document.querySelector('#releasesTop');
releasesTop.href = RELEASES;

function enable(button, asset) {
  if (!asset) return;
  button.href = asset.browser_download_url;
  button.classList.remove('disabled');
  button.removeAttribute('aria-disabled');
}

fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
  .then(async (response) => {
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    return response.json();
  })
  .then((release) => {
    const assets = release.assets || [];
    const exe = assets.find((a) => /\.exe$/i.test(a.name));
    const msi = assets.find((a) => /\.msi$/i.test(a.name));
    enable(exeButton, exe);
    enable(msiButton, msi);
    const version = release.tag_name?.replace(/^kriptta-v/i, 'v') || release.name || 'versão atual';
    status.textContent = `${version} • ${exe || msi ? 'pronta para download' : 'release sem instalador Windows'}`;
    footerVersion.textContent = `${version} • Windows 10/11 • x64`;
  })
  .catch(() => {
    status.innerHTML = `Ainda não há uma release pública. <a href="${RELEASES}">Ver GitHub Releases</a>`;
  });
