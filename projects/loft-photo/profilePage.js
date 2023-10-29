import model from './model';
import mainPage from './mainPage';
import pages from './pages';

export default {
  async setUser(user) {
    const photoComp = document.querySelector('.component-user-info-photo');
    const nameComp = document.querySelector('.component-user-info-name');
    const photosTab = document.querySelector('.component-profile-mode-photos');
    const friendsTab = document.querySelector('.component-profile-mode-friends');

    this.user = user;

    photoComp.style.backgroundImage = `url('${user.photo_100}')`;
    nameComp.innerText = `${user.first_name ?? ''} ${user.last_name ?? ''}`;
    
    const mode = localStorage.getItem('loft-photo-profile-mode') ?? '1';

    if (mode === '1') {
      photosTab.click();
    } else {
      friendsTab.click();
    }
  },

  async showPhotos() {
    const photosComp = document.querySelector('.component-user-photos');
    const photos = await model.getPhotos(this.user.id);

    photosComp.innerHTML = '';

    for (const photo of photos.items) {
      const size = model.findSize(photo);
      const element = document.createElement('div');

      element.classList.add('component-user-photo');
      element.dataset.id = photo.id;
      element.style.backgroundImage = `url(${size.url})`;
      photosComp.append(element);
    }
  },

  async showFriends() {
    const friendsComp = document.querySelector('.component-user-friends');
    const friends = await model.getFriends(this.user.id);

    friendsComp.innerHTML = '';

    for (const friend of friends.items) {
      const element = document.createElement('div');
      const photoEl = document.createElement('div');
      const nameEl = document.createElement('div');

      element.classList.add('component-user-friend');
      element.dataset.id = friend.id;
      photoEl.classList.add('component-user-friend-photo');
      photoEl.style.backgroundImage = `url(${friend.photo_100})`;
      photoEl.dataset.id = friend.id;
      nameEl.classList.add('.component-user-friend-name');
      nameEl.innerText = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
      nameEl.dataset.id = friend.id;
      element.append(photoEl, nameEl);
      friendsComp.append(element);
    }
  },

  handleEvents() {
    document
    .querySelector('.component-user-photos')
    .addEventListener('click', async (e) => {
        if (e.target.classList.contains('component-user-photo')) {
            const photoId = e.target.dataset.id;
            const friendsPhotos = await model.getPhotos(this.user.id);
            const photo = friendsPhotos.items.find((photo) => photo.id == photoId);
            const size = model.findSize(photo);

            mainPage.setFriendAndPhoto(this.user, parseInt(photoId), size.url);
            pages.openPage('main');
        }
    });

    document
    .querySelector('.component-user-friends')
    .addEventListener('click', async (e) => {
      const friendId = e.Target.dataset.id;

      if (friendId) {
        const [friend] = await model.getUsers([friendId]);
        const friendsPhotos = await model.getPhotos(friendId);
        const photo = model.getRandomElement(friendsPhotos.items);
        const size = model.findSize(photo);
        const photoStats = await model.photoStats(photoId);

        mainPage.setFriendAndPhoto(this.user, parseInt(photoId), size.url, photoStats);
        pages.openPage('main');
      }
    });

    document.querySelector('.page-profile-back').addEventListener('click', async () => {
        pages.openPage('main');
    });

    document.querySelector('.page-profile-exit').addEventListener('click', async () => {
        await model.logout();
        pages.openPage('login');
    });

    document
    .querySelector('.component-profile-mode-photos')
    .addEventListener('click', (e) => {
      const photosComp = document.querySelector('.component-user-photos');
      const friendsComp = document.querySelector('.component-user-friends');

      photosComp.classList.remove('hidden');
      friendsComp.classList.add('hidden');

      localStorage.setItem('loft-photo-profile-mode', '1');
      this.showPhotos();
    });

    document
    .querySelector('.component-profile-mode-friends')
    .addEventListener('click', (e) => {
      const photosComp = document.querySelector('.component-user-photos');
      const friendsComp = document.querySelector('.component-user-friends');

      friendsComp.classList.remove('hidden');
      photosComp.classList.add('hidden');

      localStorage.setItem('loft-photo-profile-mode', '2');
      this.showFriends();
    });
  },
};
