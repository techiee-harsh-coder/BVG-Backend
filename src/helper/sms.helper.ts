export const sendSms = async (phone: string, message: string)=>{
  const baseUrl = 'http://redirect.ds3.in/submitsms.jsp';
    const queryParams = {
      user: 'ShriPoojan',
      key: '67a7a7697fXX',
      mobile: '+91' + phone,
      message: message,
      senderid: 'SRIPUJ',
      accusage: '1',
      entityid: '1201168632184587045',
      tempid: '1207169415894815169',
    };
    const url = `${baseUrl}?${Object.keys(queryParams).map(key => `${key}=${encodeURIComponent(queryParams[key])}`).join('&')}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(response.ok);
        console.log(response.text);
        return true; 
      } else {
        console.error('Failed to send SMS:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }



