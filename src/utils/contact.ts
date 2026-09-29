import { Product, StoreSettings } from '../types';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
}

export const contactUtils = {
  copyAndOpenZalo(
    settings: StoreSettings,
    product?: Product | null,
    customText?: string,
    onShowToast?: (msg: string) => void
  ) {
    let message = '';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (product) {
      const productUrl = `${window.location.origin}/san-pham/${product.slug}`;
      message = `Chào CDHome, tôi muốn nhận báo giá sản phẩm ${product.name} - Mã ${product.code}: ${productUrl}`;
    } else if (customText) {
      message = customText;
    } else {
      message = 'Chào CDHome, tôi muốn được tư vấn/đặt lịch ghé showroom.';
    }

    // 1. Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        if (onShowToast) {
          onShowToast('Đã sao chép nội dung, hãy dán vào khung chat');
        }
      }).catch(() => {
        // Fallback
        if (onShowToast) {
          onShowToast('Đang kết nối Zalo...');
        }
      });
    }

    // 2. Open Zalo
    const zaloUrl = `https://zalo.me/${settings.zaloPhone.replace(/\D/g, '')}`;
    setTimeout(() => {
      window.open(zaloUrl, '_blank');
    }, 150);
  },

  copyAndOpenMessenger(
    settings: StoreSettings,
    product?: Product | null,
    customText?: string,
    onShowToast?: (msg: string) => void
  ) {
    let message = '';
    if (product) {
      const productUrl = `${window.location.origin}/san-pham/${product.slug}`;
      message = `Chào CDHome, tôi muốn nhận báo giá sản phẩm ${product.name} - Mã ${product.code}: ${productUrl}`;
    } else if (customText) {
      message = customText;
    } else {
      message = 'Chào CDHome, tôi muốn được tư vấn/đặt lịch ghé showroom.';
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        if (onShowToast) {
          onShowToast('Đã sao chép nội dung, hãy dán vào khung chat');
        }
      });
    }

    const messengerUrl = `https://m.me/${settings.messengerUsername}`;
    setTimeout(() => {
      window.open(messengerUrl, '_blank');
    }, 150);
  },

  copyFavoritesAndOpenZalo(
    settings: StoreSettings,
    products: Product[],
    onShowToast?: (msg: string) => void
  ) {
    if (products.length === 0) return;

    const listText = products
      .map(
        (p) => `- ${p.name} (Mã ${p.code}): ${window.location.origin}/san-pham/${p.slug}`
      )
      .join('\n');

    const message = `Chào CDHome, tôi quan tâm và muốn nhận báo giá danh sách ${products.length} sản phẩm sau:\n${listText}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        if (onShowToast) {
          onShowToast('Đã sao chép nội dung, hãy dán vào khung chat');
        }
      });
    }

    const zaloUrl = `https://zalo.me/${settings.zaloPhone.replace(/\D/g, '')}`;
    setTimeout(() => {
      window.open(zaloUrl, '_blank');
    }, 150);
  }
};
