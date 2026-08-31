import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services//slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const { data: ingredients } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (!ingredients) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients]);

  const ingredientData = ingredients?.find((x) => x._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
