import Colour from '../../models/Colour.model';

class ColourMapper {
  public static transform(data: Record<string, any>): Colour {
    return {
      id: parseInt(data.id),
      hexCode: `#${data.hexCode}`,
    };
  }
}

export default ColourMapper;
